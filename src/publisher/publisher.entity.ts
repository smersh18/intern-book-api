import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Publisher {
	constructor(org_name, address){
		this.org_name = org_name,
			this.address = address
	}
	@PrimaryGeneratedColumn()
	@PrimaryGeneratedColumn({name: "publisher_id" })
	publisher_id?: number;

	@Column()
	org_name: string;

	@Column()
	address: string;

}