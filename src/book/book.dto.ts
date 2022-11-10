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

export class ValidDto2 {
	@MaxLength(30)
	@IsString()
	org_name: string;
	@MaxLength(30)
	@IsString()
	address: string;

}