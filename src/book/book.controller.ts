import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards
} from '@nestjs/common'
import { post } from '@typegoose/typegoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { Book } from './book.entity';
import { BookService } from './book.service'
import { BookDto } from './dook.dto';


@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService) { }
	@UseGuards(JwtAuthGuard)
	@Post('findone')
	async findone(@Body() dto: BookDto): Promise<Book> {
		const book = await this.bookService.findOne(dto.book_id);
		if(!book){
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		else{
			return book
		}

	}
	@UseGuards(JwtAuthGuard)
	@Get('findall')
	async findall(): Promise<Book[]> {
		const book = await this.bookService.findAll();
		return book
	}
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Delete(':id')
	async remove(@Param('id') dto: number) {
		const book = await this.bookService.remove(dto);
		}


	@UseGuards(JwtAuthGuard)
	@Post('create')
	 async create(title: string, isbn: string): Promise<Book> {
		const book = this.bookService.create(title, isbn);
		return book
	}
}