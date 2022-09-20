import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './publisher.entity';

@Injectable()
export class PublisherService {
	constructor(
		@InjectRepository(Publisher)
		private publishersRepository: Repository<Publisher>,
	) { }

	findAll(): Promise<Publisher[]> {
		return this.publishersRepository.find();
	}

	async findOne(id: number): Promise<Publisher> {
		return this.publishersRepository.findOneBy({ publisher_id: id });
	}
}