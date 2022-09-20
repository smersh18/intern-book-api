import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Publisher {
	@PrimaryGeneratedColumn()
	publisher_id: number;

	@Column()
	org_name: string;

	@Column()
	address: string;

}