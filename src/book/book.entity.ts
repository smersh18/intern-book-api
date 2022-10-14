import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	@PrimaryGeneratedColumn({name: "book_id" })
	bookId?: number;

	@Column()
	title: string;

	@Column()
	isbn: string;

}