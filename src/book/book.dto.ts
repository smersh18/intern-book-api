import { IsString, MaxLength} from 'class-validator';


export class PageDto{
	limit?: number;

	offset?: number;
}

export class ValidDto {
	@MaxLength(30)
	@IsString()
	title: string;
	@MaxLength(30)
	@IsString()
	isbn: string;

}