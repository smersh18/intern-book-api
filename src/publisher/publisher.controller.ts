import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { PublisherDto } from './publisher.dto';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';
import {BookDto} from "../book/dook.dto";


@Controller('publisher')
export class PublisherController {
	constructor(private readonly publisherService: PublisherService) { }
	@UseGuards(JwtAuthGuard)
	@Post('findone')
	async findone(@Body() dto: PublisherDto): Promise<Publisher> {
		const publisher = await this.publisherService.findOne(dto.publisherId);
		return publisher
	}
	@UseGuards(JwtAuthGuard)
	@Get('findall')
	async findall(): Promise<Publisher[]> {
		const publisher = await this.publisherService.findAll();
		return publisher
	}
	@Delete('remove')
	async remove(@Body() dto: PublisherDto): Promise<void> {
		const book = await this.publisherService.remove(dto.publisherId);
		return book
	}
}