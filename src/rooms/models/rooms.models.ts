import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoomType } from 'src/common/enums/room-type';

export type RoomsDocument = HydratedDocument<Rooms>;

@Schema()
export class Rooms {
  @Prop({ required: true })
  room: number;
  @Prop({
    required: true,
    enum: [
      RoomType.Single,
      RoomType.Double,
      RoomType.Suite,
      RoomType.Apartment,
    ],
  })
  roomType: string;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
