import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book/book.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule,
    BookModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'experiment-postgresql-ams3-58753-do-user-6617293-0.b.db.ondigitalocean.com',
      port: 25060,
      username: 'doadmin',
      password: 'AVNS_yEo-qnPlj0zv2L5FLJg',
      database: 'defaultdb',
      entities: [Book],
      synchronize: false,
      ssl: { rejectUnauthorized: false }
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
