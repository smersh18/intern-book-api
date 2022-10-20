import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post, Put, Query,
	UseGuards
} from '@nestjs/common'
import { post } from '@typegoose/typegoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { Book } from './book.entity';
import { BookService } from './book.service'
import { BookDto } from './dook.dto';
import {PublisherDto} from "../publisher/publisher.dto";


@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService) { }

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findone(@Param('id') dto: number): Promise<Book> {
		const book = await this.bookService.findOne(dto);
		if(!book){
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		else{
			return book
		}

	}
	@UseGuards(JwtAuthGuard)
	@Get()
	async findall(): Promise<Book[]> {
		const book = await this.bookService.findAll();
		return book
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Delete(':id')
	async remove(@Param('id') dto: number) {
		if (await this.bookService.findOne(dto)){
			await this.bookService.remove(dto);
		}
		else{
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	 async create(title: string, isbn: string): Promise<Book> {
		const book = this.bookService.create(title, isbn);
		return book
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') dto: number, @Body() dto1: BookDto) {
		if (await this.bookService.findOne(dto)){
			await this.bookService.update(dto, dto1);
		}
		else{
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Get(':id')
	async findsomeone(@Query() pageOptionsDto: number) {
			await this.bookService.findSomeone(pageOptionsDto);
	}
}