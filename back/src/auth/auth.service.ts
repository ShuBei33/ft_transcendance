import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
	) {}

	async signToken(refresh_token: string, access_token: string, login: string): Promise<{ token: string }> {
		const payload = { refresh: refresh_token, access: access_token, login: login }
		const secret = process.env.JWT_SECRET;
		const token = await this.jwt.signAsync(payload, { expiresIn: '1h', secret: secret });
		return { token: token };
	}

	async signin42( login: string, access_token: string, refresh_token: string ) {
		console.log( "Salutation ", login, ", vous etez maintenant connecter" );
		console.log("votre access_token: ", access_token);
		console.log("votre refresh_token: ", refresh_token);

		const jwt = await this.signToken( refresh_token, access_token, login)
		console.log("JWT: ", jwt.token);
		return jwt;
	}




}
