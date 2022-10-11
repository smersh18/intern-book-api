import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	bookId?: number;

	@Column()
	title: string;

	@Column()
	isbn: string;

}