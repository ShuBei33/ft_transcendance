import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FtGuard } from './guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FTUser } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// FONCTION TEST POUR SAVOIR SI LA CONNECTION RESEAU EST OPERATIONNELLE
	// 1: Lancez vos containers
	// 2: depuis votre machine: curl ${API}/auth/me   res = u get me bro
	// 3: depuis une autre machine: curl ${API}/auth/me   res = u get me bro

	// ATTENTION vous devez avoir mis votre IP dans ${BACK_HOST}
	// pour la recuperer MACOS: ipconfig getifaddr en1 

	@Get('me')
	async getMe() { return ( "u get me bro." ); }

	@UseGuards(FtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('signin42')
	signin() {}

	@UseGuards(FtGuard)
	@Get('callback')
	async callback(@Req() req: Request) {
		const data = req.user as FTUser;
		await this.authService.saveToken( data.access_token, data.refresh_token);
		await this.authService.signin42( data.username );
	}

}
