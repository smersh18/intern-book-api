import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "../book/book.service";
import { AppModule } from "../app.module";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let token: string;
    let booksService: BookService;


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
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

    it("/books/findall(GET) - success", async () => {
        // Given: load all books
        const prevResponse = await (request(app.getHttpServer())
            .get("/books/findall")
            .set("Authorization", "Bearer " + token)
            .expect(200));
        const prevCount = prevResponse.body.length;

        // When: create new book
        const title = Math.random().toString(36).slice(2)
        const isbn = Math.random().toString(11)
        const createdBook = await booksService.create(title, isbn);

        // When: load all books after new has been created
        const afterResponse = await (request(app.getHttpServer())
            .get("/books/findall")
            .set("Authorization", "Bearer " + token)
            .expect(200));

        // Then: check count
        const afterCount = afterResponse.body.length;
        expect(afterCount).toEqual(prevCount + 1);

        // Then: check that crated book present in response
        // expect(createdBook).toEqual(afterResponse.body[afterResponse.body.length - 1]);
    });

    it("/books/findone (POST) - success", async () => {
        jest.setTimeout(10000);
        // When: create new book
        const title = Math.random().toString(36).slice(2)
        const isbn = Math.random().toString(11)
        const createdBook = await booksService.create(title, isbn);
        //Then: load one book after create
        let afterResponseFindone = await (request(app.getHttpServer())
            .post("/books/findone")
            .set("Authorization", "Bearer " + token)
            .send({
                "book_id": createdBook.book_id
            })
            .expect(201));
        let afterCountFindone = afterResponseFindone.body;
        // Then: check count
        expect(afterCountFindone).toBeDefined();
    });

    it("/books/findall(GET) - fail", async () => {
        // Given: load all books
        const prevResponse = await (request(app.getHttpServer())
            .get("/books/findall")
            .set("Authorization", "Bearer " + 123)
            .expect(401));
        const prevCount = prevResponse.body.length;

        // When: create new book
        const title = Math.random().toString(36).slice(2)
        const isbn = Math.random().toString(11)
        const createdBook = await booksService.create(title, isbn);

        // When: load all books after new has been created
        const afterResponse = await (request(app.getHttpServer())
            .get("/books/findall")
            .set("Authorization", "Bearer " + 123)
            .expect(401));
    });
});
afterAll(() => {
    disconnect();
});

