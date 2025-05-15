import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsDocument } from './models/rooms.models';
import { UpdateTypeRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() CreateRoomDto: CreateRoomDto,
  ): Promise<RoomsDocument | void> {
    const result = await this.roomsService.create(CreateRoomDto);
    if (!result) {
      throw new InternalServerErrorException(
        'An error occurred while creating. Try again later.',
      );
    }
    return result;
  }
  @Get('read')
  async readRooms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: RoomsDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const result = await this.roomsService.getRooms(page, limit);

      if (!result || result.data.length === 0) {
        // Возвращаем объект с пустым массивом data
        return {
          data: [],
          total: 0,
          page,
          limit,
        };
      }

      const { data, total } = result;
      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw new InternalServerErrorException('Failed to retrieve rooms');
    }
  }
  @Patch('update')
  async update(@Body() data: UpdateTypeRoomDto): Promise<RoomsDocument> {
    const result = await this.roomsService.updateRoomType(
      data.roomId,
      data.roomType,
    );
    return result;
  }
  @Delete('delete/:id')
  async deleteRoom(@Param('id') id: string): Promise<RoomsDocument> {
    return await this.roomsService.deleteRoomById(id);
  }
}
