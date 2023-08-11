import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LIST_SUFFIX_PSEUDO } from './data';

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
	) {}

	async user_validator( login: string ) {
		const ret = await this.prisma.user.count({ where: { login: login } });
		return ret != undefined ? true : false;
	}

	async pseudo_validator( pseudo: string ) {
		const ret = await this.prisma.user.count({ where: { pseudo: pseudo } });
		return ret != undefined ? true : false;
	}

	async pseudo_create( login: string ): Promise<string> {
		let pseudo = login + LIST_SUFFIX_PSEUDO[Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)];
		while ( await this.pseudo_validator( pseudo ) )
			pseudo = login + LIST_SUFFIX_PSEUDO[Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)];
		return pseudo;
	}

	async signup( login: string ) {
		const user = await this.prisma.user.create({
			data: {
				login: login,
				pseudo: await this.pseudo_create( login ),
				rank: 1800,
			}
		});
		const { createdAt, updateAt, twoFA, ...rest } = user;
		return rest;
	}

	async signToken(refresh_token: string, access_token: string, login: string): Promise<{ token: string }> {
		const payload = { refresh: refresh_token, access: access_token, login: login }
		const secret = process.env.JWT_SECRET;
		const token = await this.jwt.signAsync(payload, { expiresIn: '1h', secret: secret });
		return { token: token };
	}
	
	async signin42( login: string, access_token: string, refresh_token: string ): Promise<{ token: string }> {
		if ( await this.user_validator(login) == false )
			this.signup( login );
		return await this.signToken( refresh_token, access_token, login) ;
	}
}
