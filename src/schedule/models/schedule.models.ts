import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'Rooms', required: true })
  roomId: string;
  @Prop({
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format',
    },
  })
  startDay: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
