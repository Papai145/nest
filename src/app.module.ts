import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomsModule } from './rooms/rooms.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ScheduleModule,
    RoomsModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/my-project', {
      authSource: 'admin',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
