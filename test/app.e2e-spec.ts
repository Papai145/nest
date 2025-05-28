import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ObjectId } from 'mongodb';
import { RoomsDocument } from '../src/rooms/models/rooms.models';
import { ScheduleDocument } from 'src/schedule/models/schedule.models';
// import { RoomsDocument } from 'src/rooms/models/rooms.models';
// import { Types } from 'mongoose';

interface ErrorResponse {
  message: string[]; // Массив сообщений об ошибках
  error: string;
  statusCode: number;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let numberRoom: number;
  let roomId: string;
  let scheduleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /rooms/create should return 400 Bad Request when request body has empty fields', async () => {
    const requestBody = {
      room: '',
      roomType: '',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .send(requestBody)
      .expect(400);
  });

  it('POST /rooms/create should return 400 Bad Request when not valid fields roomType', async () => {
    const requestBody = {
      room: '1',
      roomType: 'Suite1',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .send(requestBody)
      .expect(400);
  });

  it('POST /rooms/create should return 201 when the Room object is created in the database ', async () => {
    const requestBody = {
      room: 35,
      roomType: 'Single',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(201)
      .then(({ body }: { body: RoomsDocument }) => {
        roomId = body._id.toString();
        numberRoom = body.room;
      });
  });

  it('POST /schedule/create/ should return 400 Bad Request when not valid fields roomId', async () => {
    const date = { date: '2025-06-23' };
    const id = 'invalid-room-id';
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(400)
      .then(({ body }: { body: ErrorResponse }) => {
        expect(body.message).toEqual(
          'Validation failed for field "id": id must be a mongodb id',
        );
      });
  });
  it('POST /schedule/create/ should return 400 Bad Request when not valid fields date', async () => {
    const date = { date: '2121' };
    const id = new ObjectId().toString();
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(400);
  });
  it('POST /schedule/create/ should return 201 when booking is created in the database', async () => {
    const date = { date: '2025-06-23' };
    const id = roomId;
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(201)
      .then(({ body }: { body: ScheduleDocument }) => {
        console.log(body);

        scheduleId = body._id.toString();
      });
  });

  // it('PATCH /schedule/updateDate/ should return 409 when the date of the room reservation is taken', async () => {
  //   const date = { date: '2025-06-21' };
  //   const id = roomId;
  //   return await request(app.getHttpServer())
  //     .patch(`/schedule/updateDate/${id}`)
  //     .set('Content-Type', 'application/json')
  //     .send(date)
  //     .expect(409)
  //     .then(({ body }: { body: ScheduleDocument }) => {
  //       console.log(body);
  //     });
  // });
  it('DELETE /schedule/deleteBooking/:scheduleId should return 400 Bad Request when not valid fields scheduleId', async () => {
    const id = 'not_valid_id';
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .expect(400);
  });
  it('DELETE /schedule/deleteBooking/:scheduleId should return 400 Bad Request when not found scheduleId', async () => {
    const id = new ObjectId().toHexString();
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .expect(400);
  });
  it('DELETE /schedule/deleteBooking/:scheduleId successfully deletes and returns the deleted schedule with 204 OK', async () => {
    const id = scheduleId;
    return await request(app.getHttpServer())
      .delete(`/schedule/deleteBooking/${id}`)
      .expect(204);
  });
  it('POST /schedule/create/ should return 201 when booking is created in the database', async () => {
    const date = { date: '2025-06-23' };
    const id = roomId;
    return await request(app.getHttpServer())
      .post(`/schedule/create/${id}`)
      .set('Content-Type', 'application/json')
      .send(date)
      .expect(201)
      .then(({ body }: { body: ScheduleDocument }) => {
        console.log(body);
        scheduleId = body._id.toString();
      });
  });
  it('POST /rooms/create should return 409  Conflict when an attempt was made to add an existing room', async () => {
    const requestBody = {
      room: numberRoom,
      roomType: 'Single',
    };
    return await request(app.getHttpServer())
      .post('/rooms/create')
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(409);
  });

  it('GET /rooms/read return 400 should accept numeric query parameters', async () => {
    return request(app.getHttpServer())
      .get('/rooms/read')
      .query({ limit: 'qqq' })
      .expect(400);
  });

  it('GET /rooms/read return 200 when data arrived successfully', async () => {
    return await request(app.getHttpServer())
      .get('/rooms/read')
      .query({ page: 1, limit: 10 })
      .expect(200);
  });

  it('PATCH /rooms/update return 400 Bad Request when request body has empty fields', () => {
    const requestBody = {};
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .send(requestBody)
      .expect(400);
  });

  it('PATCH /rooms/update  should return 400 Bad Request when not valid fields roomType', () => {
    const requestBody = {
      roomId: new ObjectId().toString(),
      roomType: 'Suite1',
    };
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .send(requestBody)
      .expect(400);
  });

  it('PATCH /rooms/update  should return 200 successful data update', () => {
    const requestBody = {
      roomId: roomId,
      roomType: 'Suite',
    };
    return request(app.getHttpServer())
      .patch('/rooms/update')
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(200);
  });

  it('DELETE /rooms/delete/:id should return 404 not found id for delete', async () => {
    const id = new ObjectId().toString(); // Создаем валидный ObjectId
    // console.log(`Attempting to delete room with non-existent ID: ${id}`);

    // // Убедитесь, что комнаты с таким ID нет в базе данных (просто чтобы наверняка)
    // const room = await roomsModel.findById(id); // roomsModel - это ваша модель Rooms
    // expect(room).toBeNull(); // Проверяем, что комнаты с таким ID нет

    return request(app.getHttpServer())
      .delete(`/rooms/delete/${id}`)
      .expect(404);
  });

  it('DELETE /rooms/delete/:id  should return 200 successful data delete', async () => {
    const id = roomId;
    return await request(app.getHttpServer())
      .delete(`/rooms/delete/${id}`)
      .expect(200)
      .then(({ body }: { body: request.Response }) => {
        console.log(body);
      });
  });

  afterAll(async () => {
    await app.close(); // Закрываем приложение NestJS
  });
});
