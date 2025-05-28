import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rooms, RoomsDocument } from './models/rooms.models';
import { Model, Types } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomType } from 'src/common/enums/room-type';

import { Schedule, ScheduleDocument } from '../schedule/models/schedule.models';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name) private RoomsModel: Model<RoomsDocument>,
    @InjectModel(Schedule.name) private ScheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomsDocument> {
    const existingRoom = await this.RoomsModel.findOne({
      room: createRoomDto.room,
    });
    if (existingRoom) {
      throw new ConflictException(
        `Room with number ${createRoomDto.room} already exists`,
      );
    }
    return await this.RoomsModel.create(createRoomDto);
  }
  async getRooms(
    page: number,
    limit: number,
  ): Promise<{ data: RoomsDocument[]; total: number }> {
    const skip = page > 0 ? (page - 1) * limit : 0;
    const [data, total] = await Promise.all([
      this.RoomsModel.find().skip(skip).limit(limit).exec(),
      this.RoomsModel.countDocuments().exec(),
    ]);
    return { data, total };
  }
  async updateRoomType(id: string, roomType: RoomType): Promise<RoomsDocument> {
    const updatedRoom = await this.RoomsModel.findOneAndUpdate(
      { _id: id },
      { roomType: roomType },
      { new: true, runValidators: true },
    ).exec();
    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }
    return updatedRoom;
  }

  async findById(id: string): Promise<RoomsDocument | null> {
    return await this.RoomsModel.findById(id).exec();
  }
  async deleteRoomById(id: string): Promise<RoomsDocument> {
    if (!Types.ObjectId.isValid(id)) {
      console.log('Invalid room ID:', id);
      throw new NotFoundException(`Invalid room ID: ${id}`);
    }

    try {
      const deletedRoom = await this.RoomsModel.findByIdAndDelete(id).exec();

      if (!deletedRoom) {
        console.log('Room not found:', id);
        throw new NotFoundException(`Room with ID "${id}" not found`);
      }
      console.log(1212121);

      console.log('Before deleteMany');
      await this.ScheduleModel.deleteMany({ roomId: id }).exec();
      console.log('After deleteMany');
      return deletedRoom;
    } catch (error) {
      console.error('Unexpected error during room deletion:', error);
      throw new InternalServerErrorException(
        'Failed to delete room due to a server error',
      );
    }
  }
}
