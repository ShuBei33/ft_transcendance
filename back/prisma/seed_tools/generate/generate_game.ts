import { Game, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation d'une Game entre Deux Utilisateurs					 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_game( uid1: number, uid2: number ): Promise<Game> {
	const win = Math.floor(Math.random() * 2)
	const oth_score = Math.floor(Math.random() * 4)
	const data: Game = await prisma.game.create({
		data: {
			lhsPlayer: { connect: { id: uid1 }},
			lhsScore: win ? 5 : oth_score,
			rhsPlayer: { connect: { id: uid2 }},
			rhsScore: win ? 5 : oth_score,
			winnerId: uid1,
		}
	})
	return data;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation d'une Serie de Games entre Deux Utilisateurs								//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_games( uid1: number, uid2: number, limit: number): Promise<Game[]> {
	const data: Game[] = [];
	for ( let i = 0; i < limit; i++) {
		data.push( await generate_game( uid1, uid2 ) );
	}
	return data;
}