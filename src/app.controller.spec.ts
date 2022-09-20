import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';

const productId = new Types.ObjectId().toHexString();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  it('/findone (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/findone')
      .send("1")
      .expect(201)
  });

  it('/findall(GET) - success', (done) => {
    request(app.getHttpServer())
      .get('/findall')
      .expect(201)
  });
});
afterAll(() => {
  disconnect();
});
