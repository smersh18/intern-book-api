import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { Book } from './book.entity';
import { BookService } from './book.service'
import { BookDto } from './dook.dto';

@Controller()
export class BookController {
	constructor(private readonly bookService: BookService) { }
	@UseGuards(JwtAuthGuard)
	@Post('findone')
	async findone(@Body() dto: BookDto): Promise<Book> {
		const book = await this.bookService.findOne(dto.bookId);
		return book
	}
	@UseGuards(JwtAuthGuard)
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