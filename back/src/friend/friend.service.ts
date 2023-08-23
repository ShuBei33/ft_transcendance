import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Friendship } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getFriendsList(userId: number): Promise<User[]> {
	const user = await this.prisma.user.findUnique({
	  where: { id: userId },
	  include: {
		sentInvites: {
		  where: { inviteStatus: 'ACCEPTED' },
		  include: { receiver: true },
		},
		receivedInvites: {
		  where: { inviteStatus: 'ACCEPTED' },
		  include: { sender: true },
		},
	  },
	});
  
	if (!user) {
	  throw new Error('User not found');
	}
  
	// Find mutual friends by iterating through accepted invites
	const friends = user.sentInvites
	  .filter((sentInvite) =>
		user.receivedInvites.some(
		  (receivedInvite) =>
			receivedInvite.senderId === sentInvite.receiverId
		)
	  )
	  .map((sentInvite) => sentInvite.receiver);
  
	return friends;
  }

  async deleteFriend(userId: number, friendId: number) {
    // Check if the users are friends
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        inviteStatus: 'ACCEPTED',
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    // Delete the friendship
    await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return 'Friend deleted successfully';
  }

  async getReceivedPendingInvites(userId: number): Promise<Friendship[]> {
	const receivedPendingInvites = await this.prisma.friendship.findMany({
	  where: {
		receiverId: userId,
		inviteStatus: 'PENDING',
	  },
	  include: {
		sender: true,
	  },
	});
  
	return receivedPendingInvites;
  }

}