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
				await prisma.friendship.create({
					data: {
						sender: { connect: { id: user_sender.id }},
						receiver: { connect: { id: user_recever.id }},
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