import { RoomType } from '../models/rooms.models';

export class CreateRoomDto {
  room: number;
  roomType: RoomType;
}
