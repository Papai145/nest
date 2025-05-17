import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDocument } from './models/schedule.models';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('create/:roomId')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(
    @Param('roomId') paramId: string,
    @Body() date: string,
  ): Promise<ScheduleDocument | void> {
    try {
      return this.scheduleService.crate(paramId, date);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
    }
  }
  @Patch('updateDate/:roomId')
  async updateCheckInDate(
    @Param('roomId') paramId: string,
    @Body() date: string,
  ): Promise<ScheduleDocument | void> {
    try {
      return await this.scheduleService.update(paramId, date);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw new ConflictException(err.message);
      } else if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
    }
  }
  @Delete('deleteBoking/:scheduleId')
  async deleteBooking(
    @Param('scheduleId') scheduleId: string,
  ): Promise<ScheduleDocument | null> {
    const result = await this.scheduleService.delete(scheduleId);
    if (!result) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }
    return result;
  }
  @Get('getOccupiedDatesByRoom')
  getOccupiedDatesByRoomNumber(
    @Query('roomId') roomId: string,
  ): Promise<ScheduleDocument[]> {
    return this.scheduleService.getOccupiedDatesByRoomId(roomId);
  }
}
