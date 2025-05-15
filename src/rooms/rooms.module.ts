import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rooms, RoomsSchema } from './models/rooms.models';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [
    MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
  ],
})
export class RoomsModule {}
