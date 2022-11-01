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
import {BookDto, PageDto, ValidDto} from './dook.dto';
import {PublisherDto} from "../publisher/publisher.dto";
import {resolveAny} from "dns";


@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService) { }

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findone(@Param('id') bookId: number): Promise<Book> {
		const book = await this.bookService.findOne(bookId);
		if(!book){
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		else{
			return book
		}

	}
	// @UseGuards(JwtAuthGuard)
	// @Get()
	// async findall(): Promise<Book[]> {
	// 	const book = await this.bookService.findAll();
	// 	return book
	// }

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Delete(':id')
	async remove(@Param('id') bookId: number) {
		if (await this.bookService.findOne(bookId)){
			await this.bookService.remove(bookId);
		}
		else{
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		}

	@UseGuards(JwtAuthGuard)
	@Post()
	 async create(@Body()title: ValidDto): Promise<Book> {
	// 	if (title.length > 30 || isbn.length > 11 || typeof title == "number" || typeof isbn == "number"){
	// 		throw new HttpException("неверные данные создания", HttpStatus.BAD_REQUEST)
	// }
	// 	else {
			const book = this.bookService.create(title.title, title.isbn);
			return book
		// }

	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') bookId: number, @Body() validation: ValidDto) {
		if (await this.bookService.findOne(bookId)){
			await this.bookService.update(bookId, validation);
		}
		else{
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Get()
	async findsomeone(@Query() pageOptionsDto: PageDto) {
			return await this.bookService.findSomeone(pageOptionsDto);
	}
}