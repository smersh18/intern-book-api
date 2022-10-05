import { IsNumber, IsString } from 'class-validator';

export class BookDto {
	@IsNumber()
	book_id: number;
}