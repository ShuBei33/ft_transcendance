import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Connection Ami D'une Liste de User [Complet] 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function connect_friends( users: User[] ) {
	for ( const user_sender of users ) {
		for ( const user_recever of users ) {
			if ( user_recever != user_sender ) {
				await prisma.userFriends.create({
					data: {
						user: { connect: { id: user_sender.id }},
						friend: { connect: { id: user_recever.id }},
						block: false
					}
				})
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Connection Ami De Deux Utilisateur, avec option pour Bloquer						//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function connect_friend( uid1: number, uid2: number, ob1?: boolean, ob2?: boolean) {
	await prisma.userFriends.create({
		data: {
			user: { connect: { id: uid1 }},
			friend: { connect: { id: uid2 }},
			block: ob1 ? true : false
		}
	})
	await prisma.userFriends.create({
		data: {
			user: { connect: { id: uid2 }},
			friend: { connect: { id: uid1 }},
			block: ob2 ? true : false
		}
	})
}