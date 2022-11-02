import { IsNumber } from 'class-validator';

export class PublisherDto {
	@IsNumber()
	publisherId: number;
}