import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, ScheduleDocument } from './models/schedule.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private ScheduleModel: Model<ScheduleDocument>,
  ) {}
  async crate(roomId: string, date: string): Promise<ScheduleDocument> {
    if (await this.isRoomAvailable(roomId, date)) {
      throw new ConflictException('Room is already booked for this date');
    }
    const newSchedule = new this.ScheduleModel({
      room: roomId,
      startDay: date,
    });
    return await newSchedule.save();
  }
  async update(roomId: string, date: string): Promise<ScheduleDocument> {
    if (await this.isRoomAvailable(roomId, date)) {
      throw new ConflictException('Room is already booked for this date');
    }
    const updatedSchedule = await this.ScheduleModel.findByIdAndUpdate(
      roomId,
      {
        startDay: date,
      },
      { new: true, runValidators: true },
    ).exec();
    if (!updatedSchedule) {
      throw new NotFoundException(`Schedule with ID ${roomId} not found`);
    }
    return updatedSchedule;
  }
  async isRoomAvailable(
    roomId: string,
    date: string,
  ): Promise<ScheduleDocument | undefined> {
    const booking = await this.ScheduleModel.findOne({
      room: roomId,
      startDay: date,
    }).exec();
    return booking ?? undefined;
  }
  async delete(bookingId: string): Promise<ScheduleDocument | null> {
    const deletedSchedule =
      await this.ScheduleModel.findByIdAndDelete(bookingId).exec();
    if (!deletedSchedule) {
      return null;
    }
    return deletedSchedule;
  }
  async getOccupiedDatesByRoomId(roomId: string): Promise<ScheduleDocument[]> {
    return await this.ScheduleModel.find({ roomId: roomId });
  }
}
