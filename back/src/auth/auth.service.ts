import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

	async signin42(login: string) {
		console.log( "Salutation ", login, ", vous etez maintenant connecter" );
	}

	async saveToken( access_token: string, refresh_token: string ) {
		console.log("votre access_token: ", access_token);
		console.log("votre refresh_token: ", refresh_token);
	}

}
