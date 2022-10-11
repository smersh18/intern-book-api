import { IsNumber, IsString } from 'class-validator';

export class BookDto {
	@IsNumber()
	bookId: number;
}