import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import {AppModule} from "../app.module";
import {PublisherService} from "../publisher/publisher.service";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let token: string;
    let publishersService: PublisherService;

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
        publishersService = moduleFixture.get<PublisherService>(PublisherService);
    });

    it("/publisher/findall(GET) - success", async () => {
        // load all publishers
        let prevResponse = await (request(app.getHttpServer())
            .get("/publisher/findall")
            .set("Authorization", "Bearer " + token)
            .expect(200));
        let prevCount = prevResponse.body.length;
        // create new publisher
        const org_name = Math.random().toString(36).slice(2)
        const address = Math.random().toString(11)
     await publishersService.create(org_name, address);
        // load all publishers after new has been created
        let afterResponse = await (request(app.getHttpServer())
            .get("/publisher/findall")
            .set("Authorization", "Bearer " + token)
            .expect(200));
        let afterCount = afterResponse.body.length;
        // Then: check count
        expect(afterCount).toEqual(prevCount + 1);

    });

    it("/publisher/findone (POST) - success", async () => {
        jest.setTimeout(10000);
        // When: create new publisher
        const org_name = Math.random().toString(36).slice(2)
        const address = Math.random().toString(11)
        const createdPublisher = await publishersService.create(org_name, address);
        //Then: load one publisher after create
        let afterResponseFindone = await (request(app.getHttpServer())
            .post("/publisher/findone")
            .set("Authorization", "Bearer " + token)
            .send({
                "book_id": createdPublisher.publisher_id
            })
            .expect(201));
        let afterCountFindone = afterResponseFindone.body;
        // Then: check count
        expect(afterCountFindone).toBeDefined();
    });

    it("/publisher/findall(GET) - fail", async () => {
        // load all publishers
        await (request(app.getHttpServer())
            .get("/publisher/findall")
            .set("Authorization", "Bearer " + 123)
            .expect(401));
    });

    it("/publisher/findone (POST) - fail", async () => {
        jest.setTimeout(10000);
        // When: create new publisher
        const org_name = Math.random().toString(36).slice(2)
        const address = Math.random().toString(11)
        const createdPublisher = await publishersService.create(org_name, address);
        //Then: load one publisher after create
        await (request(app.getHttpServer())
            .post("/publisher/findone")
            .set("Authorization", "Bearer " + 123)
            .send({
                "book_id": createdPublisher.publisher_id
            })
            .expect(401));
    });

    it("/publisher/findone (POST) - fail", async () => {
        jest.setTimeout(10000);
        // When: create new publisher
        const org_name = Math.random().toString(36).slice(2)
        const address = Math.random().toString(11)
        const createdPublisher = await publishersService.create(org_name, address);
        //Then: load one publisher after create
       await (request(app.getHttpServer())
            .post("/publisher/findone")
            .set("Authorization", "Bearer " + token)
            .send({
                "book_id": createdPublisher.publisher_id
            })
            .expect(201));
        let afterCountFindone = undefined
        // Then: check count
        expect(afterCountFindone).toBeUndefined();
    });

});
afterAll(() => {
    disconnect();
});

