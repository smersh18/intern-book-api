import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
	constructor(
		@InjectRepository(Book)
		private booksRepository: Repository<Book>,
	) { }

	findAll(): Promise<Book[]> {
		return this.booksRepository.find();
	}

	async findOne(id: number): Promise<Book> {
		return this.booksRepository.findOneBy({ book_id: id });
	}

	async remove(bookId: number): Promise<void> {
		await this.booksRepository.delete(bookId);
	}
}