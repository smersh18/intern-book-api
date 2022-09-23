import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';
import { AppModule } from './app.module';
import { Test, TestingModule } from '@nestjs/testing';

const productId = new Types.ObjectId().toHexString();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        "login": "dima@gmail.com",
        "password": "123456"
      });
    token = body.access_token;
  });

  it('/auth/login (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({
        "login": "dima@gmail.com",
        "password": "123456"
      })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

  it('/findall(GET) - success', (done) => {
    request(app.getHttpServer())
      .get('/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toEqual([{
          "book_id": 1,
          "title": "The Diary of a young girl",
          "isbn": "123456"
        },
        {
          "book_id": 2,
          "title": "The Diary of a bad girl",
          "isbn": "234567"
        },
        {
          "book_id": 3,
          "title": "The Diary of a sad girl",
          "isbn": "345678"
        },
        {
          "book_id": 4,
          "title": "The Diary of a tall girl",
          "isbn": "456789"
        },
        {
          "book_id": 5,
          "title": "The Diary of a stupid girl",
          "isbn": "567890"
        }]);
        done();
      });
  });

  it('/findone (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "book_id": 4
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body).toEqual({
          "book_id": 1,
          "title": "The Diary of a young girl",
          "isbn": "123456"
        });
        done();
      });
  });

  it('/publisher/findall(GET) - success', (done) => {
    request(app.getHttpServer())
      .get('/publisher/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toEqual([
          {
            "publisher_id": 1,
            "org_name": "oxford",
            "address": "NY"
          },
          {
            "publisher_id": 2,
            "org_name": "garvard",
            "address": "EN"
          },
          {
            "publisher_id": 3,
            "org_name": "kgy",
            "address": "RU"
          },
          {
            "publisher_id": 4,
            "org_name": "pty",
            "address": "KZ"
          }
        ]);
        done();
      });
  });

  it('/publisher/findone (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/publisher/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "publisher_id": 4
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body).toEqual({
          "publisher_id": 1,
          "org_name": "oxford",
          "address": "NY"
        });
        done();
      });
  });
});
afterAll(() => {
  disconnect();
});

