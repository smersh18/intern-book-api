import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import {AppModule} from "../app.module";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/auth/login (POST) - success", (done) => {
        // login
        request(app.getHttpServer())
            .post("/auth/login")
            .send({
                "login": "dima@gmail.com",
                "password": "123456"
            })
            .expect(200)
            .then(({ body }: request.Response) => {
                //check token
                expect(body.access_token).toBeDefined();
                done();
            });
    });
});
afterAll(() => {
    disconnect();
});

