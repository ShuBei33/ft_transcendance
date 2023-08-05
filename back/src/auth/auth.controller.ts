import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {

	// FONCTION TEST POUR SAVOIR SI LA CONNECTION RESEAU EST OPPERATIONNELLE
	// 1: Lancer vos containers
	// 2: depuis votre machine: curl ${API}/auth/me   res = u get me bro
	// 3: depuis une autre machine: curl ${API}/auth/me   res = u get me bro

	// ATTENTION vous devez avoir mis votre IP dans ${BACK_HOST}
	// pour la recuperer MACOS: ipconfig getifaddr en1 

	@Get('me')
	async getMe() {
		return "u get me bro."
	}

}
