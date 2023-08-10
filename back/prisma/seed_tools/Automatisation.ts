import { User } from "@prisma/client";
import { USER_DFL } from "./data";
import { generate_users } from "./generate/generate_user";
import { connect_friends } from "./generate/generate_friend";
import { generate_games } from "./generate/generate_game";
import { rand } from "./generate/random";
import { generate_discussion } from "./generate/generate_discussion";


export async function seed_dfl() {

	// Creation de nos Profiles.
	const user_dfl: User[] = await generate_users( USER_DFL );
	
	// Connection entre nous pour les DM.
	await connect_friends( user_dfl );
	
	// Creation de L'historique de parti.
	for ( const user of user_dfl ) {
		await generate_games( user.id, user_dfl[rand(user_dfl.length)].id, rand(5) + 2 );
	}

	// Creation des discussions.
	for ( let i = 0; i < user_dfl.length; i++ ) {
		for ( let j = i + 1; j < user_dfl.length; j++ ) {
			generate_discussion( user_dfl[i].id, user_dfl[j].id );
		}
	}

}