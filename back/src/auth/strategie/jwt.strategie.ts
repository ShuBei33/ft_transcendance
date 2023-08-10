import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	async validate( payload: { refresh: string, access: string, login: string }) {
		// console.log( "Contenue du JWT: ")
		// console.log( payload.access )
		// console.log( payload.login )
		// console.log( payload.refresh )

		const user = await this.prisma.user.findFirst({ where: { login: payload.login }});

		return ({
			access_token: payload.access,
			refresh_token: payload.refresh,
			user: user
		});
	}
}