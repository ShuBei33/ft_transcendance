/*
**			Controlleur de l'authentification
*/

import { Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller('auth')

export class AuthController {
	constructor(private authService: AuthService) {}	// Instancie le Service dans le controlleur

	@Get()
		findAll(): string {
			return 'je ne sais pas ce que je fais'
		}
	/* Creation de 2 points d'entree pour les fonctions login et signin*/
	@Post('login')
		login(@Req() req: Request) {  // Req provient d'express
			console.log(req);
			return this.authService.login();
		}

	@Post('signin')
		signin() {}
}