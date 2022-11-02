import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }


	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		if (login == "dima@gmail.com" && password == "123456") {
			const { email } = { email: "dima@gmail.com" }
			return this.authService.login(email);
		}

	}


}