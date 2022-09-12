import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { Book } from './book.entity';
import { BookService } from './book.service'
import { BookDto } from './dook.dto';

@Controller()
export class BookController {
	constructor(private readonly bookService: BookService) { }

	@Post('findone')
	async findone(@Body() dto: BookDto): Promise<Book> {
		const book = await this.bookService.findOne(dto.bookId);
		return book
	}
	@Get('findall')
	async findall(): Promise<Book[]> {
		const book = await this.bookService.findAll();
		return book
	}

	@Delete('remove')
	async remove(@Body() dto: BookDto): Promise<void> {
		const book = await this.bookService.remove(dto.bookId);
	}
}