import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';
import { AppModule } from './app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book/book.service';
import { PublisherService } from './publisher/publisher.service';
import { response } from 'express';

const productId = new Types.ObjectId().toHexString();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;
  let booksService: BookService;
  let publishersService: PublisherService;

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

    booksService = moduleFixture.get<BookService>(BookService);
    publishersService = moduleFixture.get<PublisherService>(PublisherService);
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

  it('/findall(GET) - success', async () => {
    let resp1 = await (request(app.getHttpServer())
      .get('/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let a = resp1.body.length
    await booksService.create("nazvanie", "192783")
    let resp2 = await (request(app.getHttpServer())
      .get('/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let b = resp2.body.length
    expect(b).toEqual(a + 1);
  });

  it('/findone (POST) - success', async () => {
    jest.setTimeout(10000)
    let resp1 = await (request(app.getHttpServer())
      .get('/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let a = resp1.body
    await booksService.create("nazvanie", "192783")
    let resp4 = await (request(app.getHttpServer())
      .get('/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let d = resp4.body
    let resp2 = await (request(app.getHttpServer())
      .post('/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "book_id": a.length
      })
      .expect(201))
    let b = resp2.body
    let resp3 = await (request(app.getHttpServer())
      .post('/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "book_id": d.length
      })
      .expect(201))
    let c = resp3.body
    expect(b).toEqual(c);
  });

  it('/publisher/findall(GET) - success', async () => {
    let resp1 = await (request(app.getHttpServer())
      .get('/publisher/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let a = resp1.body.length
    publishersService.create("nazvanie", "192783")
    let resp2 = await (request(app.getHttpServer())
      .get('/publisher/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let b = resp2.body.length
    expect(b).toEqual(a + 1);

  });

  it('/publisher/findone (POST) - success', async () => {
    let resp1 = await (request(app.getHttpServer())
      .get('/publisher/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let a = resp1.body
    publishersService.create("nazvanie", "192783")
    let resp4 = await (request(app.getHttpServer())
      .get('/publisher/findall')
      .set('Authorization', 'Bearer ' + token)
      .expect(200))
    let d = resp4.body
    let resp2 = await (request(app.getHttpServer())
      .post('/publisher/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "publisher_id": a.length
      })
      .expect(201))
    let b = resp2.body
    let resp3 = await (request(app.getHttpServer())
      .post('/publisher/findone')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "publisher_id": d.length
      })
      .expect(201))
    let c = resp3.body
    expect(b).toEqual(c);
  });

});
afterAll(() => {
  disconnect();
});

