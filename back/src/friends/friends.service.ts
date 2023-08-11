import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
	) {}

	async getFriendsListByUserId(userId: number) {
	    const list = await this.prisma.friendship.findMany();
		console.log(list);
	}
}

// {
// 	where: {
// 		userId,
// 	},
// 	select: {
// 		friend: {
// 			select: {
// 				pseudo: true
// 			}
// 		}
// 	}
// }

// 	async createFriendShip(senderId: number, receiverId: number, status: string) {
// 		const createdFriendship = await this.prisma.friendship.create({
// 			data: {
// 				sender: {
// 					connect: {
// 						senderId: {id: senderId},
// 					} 
// 				},
// 			}
// 		})
// 	}
// }
