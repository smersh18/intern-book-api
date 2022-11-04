import {Body, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import { Book } from './book.entity';
import {PageDto, ValidDto} from "./book.dto";
import {Publisher} from "../publisher/publisher.entity";

@Injectable()
export class BookService {
	constructor(
		@InjectRepository(Book)
		private booksRepository: Repository<Book>,
		private publishersRepository: Repository<Publisher>,
		private connection: Connection
	) { }

	async findOne(id: number): Promise<Book> {
		return this.booksRepository.findOneBy({ bookId: id });
	}

	async remove(bookId: number): Promise<void> {
		await this.booksRepository.delete(bookId);
	}

	async create(title: string, isbn: string): Promise<Book> {
		return this.booksRepository.save({ title: title, isbn: isbn });
	}

	async update(bookId: number, body: any): Promise<void>{
			let b = await this.booksRepository.update(bookId,body)
			console.log(b)
	}

	async findSomeone(page: PageDto): Promise<Book[]>{
		return await this.booksRepository.find({skip: page.offset, take: page.limit})
	}

	async createMultipleBooks(title: string, isbn: string, org_name: string, address: string) {
		const queryRunner = this.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await queryRunner.manager.save({ title: title, isbn: isbn });
			await queryRunner.manager.save({ org_name: org_name, address: address });

			await queryRunner.commitTransaction();
		}catch (err) {
			await queryRunner.rollbackTransaction();
		}finally {
			await queryRunner.release();
		}
	}
}