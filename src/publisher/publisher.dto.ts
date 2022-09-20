import { IsNumber, IsString } from 'class-validator';

export class PublisherDto {
	@IsNumber()
	publisherId: number;
}