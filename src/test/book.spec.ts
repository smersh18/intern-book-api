import { INestApplication } from "@nestjs/common";
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

    it('/books/:id (PUT) - success', async () => {
        jest.setTimeout(10000);
        // When: create new book
        const createdBook = await createBook()
// When: delete created book
        await (request(app.getHttpServer())
            .put('/books/' + createdBook.bookId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200));
    });

    it('/books/:id (DELETE) - unreal book', () => {
        // When: delete book
        request(app.getHttpServer())
            .delete('/books/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

});
afterAll(() => {
    disconnect();
});

