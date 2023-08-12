import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FtGuard, JwtGuard } from './guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GetToken, GetUser } from './decorator';
import { FTAuth } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('checkJWT')
	async checkJWT(@GetUser() user, @GetToken() tokens) {
		console.log("user: ", user);
		console.log("tokens: ", tokens);
		const { createdAt, updateAt, twoFA, ...rest } = user;
		return ({ user: rest });
	}
0
	@UseGuards(FtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('signin42')
	signin() {}

	@UseGuards(FtGuard)
	@Get('callback')
	async callback(@Req() req: Request) {
		const data = req.user as FTAuth;
		return this.authService.signin42( data.username, data.access_token, data.refresh_token );
	}
}
