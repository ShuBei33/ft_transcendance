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
export async function generate_user( user: GEN_CreateUser ): Promise<User> {
	const data = await prisma.user.create({
		data: {
			...user,
		}
	})
	return data;
}

