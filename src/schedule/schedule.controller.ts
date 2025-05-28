// import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  // Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  // Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDocument } from './models/schedule.models';
import { DateDto } from './dto/date.dto';
import { IdParamDto } from './dto/paramId.dto';
import { scheduleValidator } from './validators/schedule.validator';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('create/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: scheduleValidator,
    }),
  )
  async createBooking(
    @Param() roomId: IdParamDto,
    @Body() dateObj: DateDto,
  ): Promise<ScheduleDocument | void> {
    try {
      return this.scheduleService.createSchedule(roomId.id, dateObj.date);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }
  @Patch('updateDate/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: scheduleValidator,
    }),
  )
  async updateCheckInDate(
    @Param() roomId: IdParamDto,
    @Body() dateObj: DateDto,
  ): Promise<ScheduleDocument | void> {
    try {
      return await this.scheduleService.UpdateBookingDate(
        roomId.id,
        dateObj.date,
      );
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error; // Перебрасываем ConflictException и NotFoundException
      }
      console.error('Unexpected error:', error); // Логируем неожиданные ошибки
      throw new Error('Failed to update schedule');
    }
  }
  @Delete('deleteBooking/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: scheduleValidator,
    }),
  )
  async deleteBooking(
    @Param() scheduleId: IdParamDto,
  ): Promise<ScheduleDocument> {
    try {
      const result = await this.scheduleService.deletingBooking(scheduleId.id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
  // @Get('getOccupiedDatesByRoom')
  // getOccupiedDatesByRoomNumber(
  //   @Query('roomId') roomId: string,
  // ): Promise<ScheduleDocument[]> {
  //   return this.scheduleService.getOccupiedDatesByRoomId(roomId);
  // }
}
