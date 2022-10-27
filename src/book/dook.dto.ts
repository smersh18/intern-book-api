import {IsNumber, IsString, MaxLength} from 'class-validator';
import {Column} from "typeorm";

export class BookDto {
	@IsNumber()
	bookId: number;
}

export class PageDto{
	limit?: number;
	offset?: number;
}

export class ValidDto {
	@MaxLength(30)
	@IsString()
	title: string;
	@MaxLength(30)
	@IsString()
	isbn: string;

}