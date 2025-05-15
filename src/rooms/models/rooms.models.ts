import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomsDocument = HydratedDocument<Rooms>;

export enum RoomType {
  Single = 'Single',
  Double = 'Double',
  Suite = 'Suite',
  Apartment = 'Apartment',
}

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
