import { RoomType } from '../models/rooms.models';

export class UpdateTypeRoomDto {
  roomId: string;
  roomType: RoomType;
}
