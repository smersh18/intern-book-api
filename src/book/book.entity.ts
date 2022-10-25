import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {isNotEmpty, isString, MaxLength} from "class-validator";

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	@PrimaryGeneratedColumn({name: "book_id" })

	bookId?: number;
	@MaxLength(30)
	@isString()
	@Column()
	title: string;
	@MaxLength(30)
	@isString()
	@Column()
	isbn: string;

}