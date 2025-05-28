import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsDocument } from './models/rooms.models';
import { UpdateTypeRoomDto } from './dto/update-room.dto';
import { ReadRoomDto } from './dto/read-room.dto';
import { roomValidator } from './validators/room.validator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: roomValidator,
    }),
  )
  async create(
    @Body() CreateRoomDto: CreateRoomDto,
  ): Promise<RoomsDocument | void> {
    try {
      const result = await this.roomsService.create(CreateRoomDto);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating. Try again later.',
        );
      }
    }
  }

  @Get('read')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: roomValidator,
    }),
  )
  async readRooms(@Query() query: ReadRoomDto): Promise<{
    data: RoomsDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const result = await this.roomsService.getRooms(query.page, query.limit);
      return {
        ...result,
        page: query.page,
        limit: query.limit,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve rooms');
    }
  }

  @Patch('update')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: roomValidator,
    }),
  )
  async update(@Body() data: UpdateTypeRoomDto): Promise<RoomsDocument> {
    const result = await this.roomsService.updateRoomType(
      data.roomId,
      data.roomType,
    );
    return result;
  }
  @Delete('delete/:id')
  async deleteRoom(@Param('id') id: string): Promise<RoomsDocument> {
    try {
      return await this.roomsService.deleteRoomById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Важно!
      } else {
        console.error('Unexpected error:', error);
        throw new InternalServerErrorException(
          'Failed to delete room due to a server error',
        );
      }
    }
  }
}
