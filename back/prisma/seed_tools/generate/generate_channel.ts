import { PrismaClient, Discussion } from "@prisma/client";
import { LIST_RAND_CHAN } from "../data/rand_channels";
import { rand } from "./random";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation d'un channel			                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
// export async function generate_channel(uid1: number) {
// 	for ( let i = 0; i < 5; i++ ) {
// 		const content = LIST_RAND_CHAN[ rand( LIST_RAND_CHAN.length )];
// 		// console.log(content);
// 		await prisma.channel.create({
// 			data: {
// 				name: content,
// 				user: {connect: uid1},
// 			}
// 		})
// 	}
// }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation d'un utilisateur de channel							            		//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
// export async function generate_usrChan(uid: number) {
// 	const data = await prisma.usrChan.create({
// 		data: {
// 			user1: {connect: {id: uid1}},
// 		}
// 	});
// 	console.log("Creation des messages:")
// 	await generate_channel( data.id, uid1, uid2, rand(20) + 2);
// }
