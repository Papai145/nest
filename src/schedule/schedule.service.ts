import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, ScheduleDocument } from './models/schedule.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rooms, RoomsDocument } from '../rooms/models/rooms.models';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private ScheduleModel: Model<ScheduleDocument>,
    @InjectModel(Rooms.name) private RoomsModel: Model<RoomsDocument>,
  ) {}
  async createSchedule(
    roomId: string,
    bookingDate: string,
  ): Promise<ScheduleDocument> {
    if (!(await this.RoomsModel.exists({ _id: roomId }))) {
      throw new BadRequestException('The identifier does not exist');
    }
    if (await this.IsRoomBooked(roomId, bookingDate)) {
      throw new ConflictException('Room is already booked for this date');
    }
    const newSchedule = new this.ScheduleModel({
      roomId: roomId,
      startDay: bookingDate,
    });
    return await newSchedule.save();
  }
  async UpdateBookingDate(
    roomId: string,
    date: string,
  ): Promise<ScheduleDocument> {
    try {
      if (await this.IsRoomBooked(roomId, date)) {
        throw new ConflictException('Room is already booked for this date');
      }
      const updatedSchedule = await this.ScheduleModel.findByIdAndUpdate(
        { roomId: roomId },
        {
          startDay: date,
        },
        { new: true, runValidators: true },
      ).exec();
      if (!updatedSchedule) {
        throw new NotFoundException(
          `Schedule with number room ${roomId} not found`,
        );
      }
      return updatedSchedule;
    } catch {
      throw new Error('Failed to update schedule due to a database error');
    }
  }
  async IsRoomBooked(roomId: string, date: string): Promise<boolean> {
    const booking = await this.ScheduleModel.findOne({
      roomId: roomId,
      startDay: date,
    }).exec();
    return !!booking;
  }
  async deletingBooking(bookingId: string): Promise<ScheduleDocument> {
    const deletedSchedule =
      await this.ScheduleModel.findByIdAndDelete(bookingId).exec();
    if (!deletedSchedule) {
      throw new NotFoundException(`Schedule with ID ${bookingId} not found`);
    }
    return deletedSchedule;
  }
  // async getOccupiedDatesByRoomId(roomId: string): Promise<ScheduleDocument[]> {
  //   return await this.ScheduleModel.find({ roomId: roomId });
  // }
}
