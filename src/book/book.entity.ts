import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, MaxLength} from "class-validator";

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	@PrimaryGeneratedColumn({name: "book_id" })

	bookId?: number;
	@MaxLength(30)
	@IsString()
	@Column()
	title: string;
	@MaxLength(30)
	@IsString()
	@Column()
	isbn: string;

}