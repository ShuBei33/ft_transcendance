import { GEN_CreateUser } from "../data";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation De Plusieurs Users					 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
export async function generate_users( users: GEN_CreateUser[] ): Promise<User[]> {
	const data: User[] = [];
	for (const user of users) {
		data.push( await prisma.user.create({
			data: {
				...user,
			}
		}))
	}
	return data;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation D'un User							 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
// export async function generate_user( user: GEN_CreateUser ): Promise<User> {
// 	const data = await prisma.user.create({
// 		data: {
// 			...user,
// 		}
// 	})
// 	return data;
// }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Verifier que le login n'est pas deja pris			 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
// async function isLoginTaken(login: string) {
// 	const existingUser = await prisma.user.findFirst({
// 	  where: {
// 		login: login
// 	  }
// 	});
// 	return !!existingUser;
//   }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation De Plusieurs Users					 										//
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
// export async function generate_users( users: GEN_CreateUser[] ): Promise<User[]> {
// 	const data: User[] = [];
// 	for (const user of users) {
// 		let login = user.login;
// 		while (wait isLoginTaken(login)) {
// 			login = 
// 		}
// 		data.push( await prisma.user.create({
// 			data: {
// 				...user,
// 				login: login
// 			}
// 		}))
// 	}
// 	return data;
// }
