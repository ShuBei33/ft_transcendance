import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-42';
import { FTAuth } from "../dto";

// Grace a passport-42 l'autentification est faite automatiquement
// Il suffit de respecter le format de la strategie: clientID clientSecret callbackURL
// Elle s'occupera elle meme du transfer du code pour te donner les tokens et ton profile

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy){
	constructor() {
		super({
			clientID: process.env.API_UID42,
			clientSecret: process.env.API_SECRET42,
			callbackURL: process.env.RED_URI,
		});
	}

	async validate( access_token: string, refresh_token: string, profile: Profile ): Promise<FTAuth> {
		return ({
			access_token: access_token,
			refresh_token: refresh_token,
			username: profile.username
		});
	}
}