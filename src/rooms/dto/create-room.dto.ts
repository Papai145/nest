import { RoomType } from 'src/common/enums/room-type';

export class CreateRoomDto {
  room: number;
  roomType: RoomType;
}
