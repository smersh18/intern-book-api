import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { PublisherDto } from './publisher.dto';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';


@Controller('publisher')
export class PublisherController {
	constructor(private readonly publisherService: PublisherService) { }
	@UseGuards(JwtAuthGuard)
	@Post('findOne')
	async findOne(@Body() dto: PublisherDto): Promise<Publisher> {
		return await this.publisherService.findOne(dto.publisherId);

	}
	@UseGuards(JwtAuthGuard)
	@Get('findAll')
	async findAll(): Promise<Publisher[]> {
		return await this.publisherService.findAll();

	}
	@Delete('remove')
	async remove(@Body() dto: PublisherDto): Promise<void> {
		return await this.publisherService.remove(dto.publisherId);

	}
}