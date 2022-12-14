import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book/book.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PublisherModule } from './publisher/publisher.module';
import { Publisher } from './publisher/publisher.entity';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot(),
    BookModule,
    PublisherModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'experiment-postgresql-ams3-58753-do-user-6617293-0.b.db.ondigitalocean.com',
      port: 25060,
      username: 'doadmin',
      password: 'AVNS_yEo-qnPlj0zv2L5FLJg',
      database: 'defaultdb',
      entities: [Book, Publisher],
      synchronize: false,
      ssl: { rejectUnauthorized: false }
    })]
})
export class AppModule { }
