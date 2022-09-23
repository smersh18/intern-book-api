import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	book_id?: number;

	@Column()
	title: string;

	@Column()
	isbn: string;

}