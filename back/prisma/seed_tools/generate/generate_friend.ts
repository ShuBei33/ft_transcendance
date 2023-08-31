import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Connection Ami D'une Liste de User [Complet] 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function connect_friends( users: User[] ) {
	for ( let i = 0; i < users.length; i++ ) {
		for ( let j = i + 1; j < users.length; j++ ) {
			if ( users[i] != users[j] ) {
				await prisma.friendship.create({
					data: {
						sender: { connect: { id: users[j].id }},
						receiver: { connect: { id: users[i].id }},
                        inviteStatus: 'ACCEPTED'
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
// export async function connect_friend( uid1: number, uid2: number) {
// 	await prisma.friendship.create({
// 		data: {
// 			sender: 			{ connect: { id: uid1 }},
// 			receiver: 			{ connect: { id: uid2 }},
// 			// countResendSndr:    {},
//  			// countResendRcvr:    {},
//   			// senderHasBlocked:   {},
//   			// receiverHasBlocked: {}
// 		}
// 	})
// }