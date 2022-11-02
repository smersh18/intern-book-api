import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import {disconnect, Types} from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "../book/book.service";
import { AppModule } from "../app.module";

describe("BookController (e2e)", () => {
    let app: INestApplication;
    let token: string;
    let booksService: BookService;
    async function createBook(){
        const title = Math.random().toString(36).slice(2)
        const isbn = Math.random().toString(11)
        return await booksService.create(title, isbn);
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe())
        await app.init();

        const { body } = await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                "login": "dima@gmail.com",
                "password": "123456"
            });
        token = body.access_token;
        booksService = moduleFixture.get<BookService>(BookService);

    });

    it("/books(GET) - success", async () => {
        // Given: load all books
        const prevResponse = await (request(app.getHttpServer())
            .get("/books")
            .set("Authorization", "Bearer " + token)
            .expect(200));
        const prevCount = prevResponse.body.length;

        // When: create new book
        await createBook()

        // When: load all books after new has been created
        const afterResponse = await (request(app.getHttpServer())
            .get("/books")
            .set("Authorization", "Bearer " + token)
            .expect(200));

        // Then: check count
        const afterCount = afterResponse.body.length;
        expect(afterCount).toEqual(prevCount + 1);
    });

    it("/books/:id (GET) - success", async () => {
        jest.setTimeout(10000);
        // When: create new book
        const createdBook = await createBook()

        //Then: load one book after create
        let FindoneResult = await (request(app.getHttpServer())
            .get("/books/" + createdBook.bookId)
            .set("Authorization", "Bearer " + token)
            .expect(200));
        // Then: check book
        expect(FindoneResult.body).toEqual(createdBook);
    });

    it("/books(GET) - fail token", async () => {
        // Given: load all books
        await (request(app.getHttpServer())
            .get("/books")
            .set("Authorization", "Bearer " + 123)
            .expect(401));
    });

    it("/books/:id (GET) - fail token", async () => {
        jest.setTimeout(10000);
        // When: create new book
        const createdBook = await createBook()
        //Then: load one book after create
        await (request(app.getHttpServer())
            .get("/books/" + createdBook.bookId)
            .set("Authorization", "Bearer " + 123)
            .expect(401));
    });

    it('/books/:id (DELETE) - success', async () => {
        jest.setTimeout(10000);
        // When: create new book
        const createdBook = await createBook()
// When: delete created book
        await (request(app.getHttpServer())
            .delete('/books/' + createdBook.bookId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200));
// When: check deleted book
       await (request(app.getHttpServer())
           .get("/books/" + createdBook.bookId)
            .set("Authorization", "Bearer " + token)
            .expect(404,  {
                statusCode: 404,
                message: "Книга не найдена"
            }));
    });

    it('/books/:id (DELETE) - unreal book', () => {
        // When: delete book
        request(app.getHttpServer())
            .delete('/books/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

    it('/books/:id (POST) - success', async () => {
        jest.setTimeout(10000);
        // When: create new book
        const createdBook = await createBook()
// When: update created book
        await (request(app.getHttpServer())
            .put('/books/' + createdBook.bookId)
            .set('Authorization', 'Bearer ' + token)
            .send({
                "title": "999",
                "isbn": "999"
            })
            .expect(200));
// When: check updated book`
        await (request(app.getHttpServer())
            .get("/books/" + createdBook.bookId)
            .set("Authorization", "Bearer " + token)
            .expect({
                "bookId": createdBook.bookId,
                "title": "999",
                "isbn": "999"
            }));
    });

    it('/books (POST) - fail', async () => {
        jest.setTimeout(10000);
// When: create book
        await (request(app.getHttpServer())
            .post('/books')
            .set('Authorization', 'Bearer ' + 123)
            .send({
                "title": "999",
                "isbn": "999"
            })
            .expect(401));
    });

    it('/books (POST) - fail all null', async () => {
        jest.setTimeout(10000);
        // When: create book
        await (request(app.getHttpServer())
            .post('/books')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "title": null,
                "isbn": null
            })
            .expect(400));
    });

    it('/books (POST) - fail title number', async () => {
        jest.setTimeout(10000);
        // When: create book
        await (request(app.getHttpServer())
            .post('/books')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "title": 999,
                "isbn": "999"
            })
            .expect(400));
    });
    it('/books (POST) - fail isbn number', async () => {
        jest.setTimeout(10000);
        // When: create book
        await (request(app.getHttpServer())
            .post('/books')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "title": "99999",
                "isbn": 999
            })
            .expect(400));
    });

    it("/books (GET) - success", async () => {
        jest.setTimeout(10000);
        const limit = Math.random().toString(10)
        const offset = Math.random().toString(10)
        //Then: load page from book after create
        let FindoneResult = await (request(app.getHttpServer())
            .get("/books?limit=" + limit + "&offset=" + offset)
            .set("Authorization", "Bearer " + token)
            .expect(200));
        // Then: check page
        expect(FindoneResult.body.length == limit);
    });

    it("/books (GET) - fail", async () => {
        jest.setTimeout(10000);
        const limit = Math.random().toString(10)
        const offset = Math.random().toString(10)
        //Then: load page from book after create
        await (request(app.getHttpServer())
            .get("/books?limit=" + limit + "&offset=" + offset)
            .set("Authorization", "Bearer " + 123)
            .expect(401));
    });

    it("/books(POST) - fail", async () => {
        await (request(app.getHttpServer())
            .post("/books")
            .set("Authorization", "Bearer " + token)
            .send({
                "title": "999999999999999999999999999999999999999999999999999999999999999999999999999999999",
                "isbn": "999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
            })
            .expect(400));
    });

});
afterAll(() => {
    disconnect();
});

