import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { UserLite } from "src/user/dto";
import { User } from "@prisma/client";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, '2fa-jwt') {
	constructor(private prisma: PrismaService) {
		super ({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	async validate(payload: {refresh: string, access: string, user: User}) {
		if (!payload.user.twoFA) {
			return payload;
		}

		if (payload.user.is2FAAuthenticated) {
			return payload;
		}
	}
}