import { User } from "@prisma/client";
import { USER_DFL } from "./data";
import { rand } from "./generate/random";
import { generate_users } from "./generate/generate_user";
import { connect_friends } from "./generate/generate_friend";
import { generate_channels } from "./generate/generate_channel";
import { generate_discussion } from "./generate/generate_discussion";
import { generate_games } from "./generate/generate_game";
import { PrismaClient } from "@prisma/client";

export async function seed_dfl() {

	const prisma = new PrismaClient();
	
	// Reset de la database pour eviter probleme de doublons lors de seedings successifs... 
	// await prisma.game.deleteMany({});
	// await prisma.achievement.deleteMany({});
	// await prisma.discussionMsg.deleteMany({});
	// await prisma.discussion.deleteMany({});
	// await prisma.channelMsg.deleteMany({});
	// await prisma.channel.deleteMany({});
	// await prisma.chanUsr.deleteMany({});
	// await prisma.friendship.deleteMany({});
	// await prisma.user.deleteMany({});

	// Creation de nos profils.
	const user_dfl: User[] = await generate_users( USER_DFL );
	
	// Connection entre nous pour les DMs.
	await connect_friends( user_dfl );
	
	// Creation d'un channel par user.
	await generate_channels();

	// Creation de l'historique de parties.
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
