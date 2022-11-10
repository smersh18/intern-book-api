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
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { Book } from './book.entity';
import { BookService } from './book.service'
import {PageDto, ValidDto, ValidDto2} from './book.dto';
import {PublisherService} from "../publisher/publisher.service";
import { Connection } from "typeorm";


@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService,  private connection: Connection) { }

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findOne(@Param('id') bookId: number): Promise<Book> {
		const book = await this.bookService.findOne(bookId);
		if(!book){
			throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
		}
		else{
			return book
		}

	}

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
		return  this.bookService.create(title.title, title.isbn);
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
	@Post('createMultipleBooks')
	async createMultipleBooks(@Body()title: ValidDto, @Body()org_name: ValidDto2) {
		return  this.bookService.createMultipleBooks(title.title, title.isbn, org_name.org_name, org_name.address)
	}

	// @UseGuards(JwtAuthGuard)
	// @HttpCode(200)
	// @Get()
	// async findSomeOne(@Query() pageOptionsDto: PageDto) {
	// 	return await this.bookService.findSomeone(pageOptionsDto);
	// }

@UseGuards(JwtAuthGuard)
	@Get()
	async findall(): Promise<Book[]> {
		const book = await this.bookService.findAll();
		return book
	}
}