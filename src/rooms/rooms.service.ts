import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rooms, RoomsDocument } from './models/rooms.models';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomType } from 'src/common/enums/room-type';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name) private RoomsModel: Model<RoomsDocument>,
  ) {}

  async create(CreateRoomDto: CreateRoomDto): Promise<RoomsDocument> {
    return await this.RoomsModel.create(CreateRoomDto);
  }
  async getRooms(
    page: number,
    limit: number,
  ): Promise<{ data: RoomsDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const data = await this.RoomsModel.find().skip(skip).limit(limit).exec();
    const total = await this.RoomsModel.countDocuments().exec();
    // return { data, total };
    if (data.length === 0) {
      return { data: [], total: 0 };
    }
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
    const result = await this.RoomsModel.findOneAndDelete({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }
    return result;
  }
}
