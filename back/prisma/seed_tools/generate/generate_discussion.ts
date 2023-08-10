import { PrismaClient, Discussion } from "@prisma/client";
import { LIST_RAND_MSG } from "../data/rand_messages";
import { rand } from "./random";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Protection pour eviter de cree des discussions en double							//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function check_discussion(uid1: number, uid2: number) {
	const count = await prisma.discussion.count({
		where: {
		  OR: [
			{ userId1: uid1, userId2: uid2 },
			{ userId1: uid2, userId2: uid1 },
		  ],
		},
	  });
	return count > 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation D'un discution entre deux Utilisateurs										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_disc_msgs( discid: number, uid1: number, uid2: number, limit: number) {
	for ( let i = 0; i < limit; i++ ) {
		const content = LIST_RAND_MSG[ rand( LIST_RAND_MSG.length )];
		console.log(content);
		await prisma.discussionMsg.create({
			data: {
				content: content,
				user: {connect: {id: i % 2 || i % 3 ? uid1 : uid2}},
				discussion: {connect: {id: discid}}
			}
		})
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation D'un discution entre deux Utilisateurs										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_discussion( uid1: number, uid2: number ) {
	const data = await prisma.discussion.create({
		data: {
			user1: {connect: {id: uid1}},
			user2: {connect: {id: uid2}},
		}
	});
	console.log("Creation des messages:")
	await generate_disc_msgs( data.id, uid1, uid2, rand(20) + 2);
}
