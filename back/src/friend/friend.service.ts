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

	if (userId === friendId) {
		throw new Error('You cannot delete yourself');
	}

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

  async acceptFriendInvitation(
    userId: number,
    answer: boolean,
    fromUserPseudo: string,
  ): Promise<Friendship> {
    try {
      console.log('FUNCTION AcceptFriendInvitation was called');
      console.log('User ID: ', userId);
      console.log('Answer: ', answer);
      console.log('From User Pseudo: ', fromUserPseudo);

      // Check if the answer is a valid boolean
      if (typeof answer !== 'boolean') {
        throw new Error('Invalid answer format. Use true for accept or false for deny.');
      }

      // Find the sender user by their pseudo (assuming 'pseudo' is the property for the user's pseudo)
      const sender = await this.prisma.user.findUnique({
        where: {
          pseudo: fromUserPseudo,
        },
      });

      if (!sender) {
        throw new Error('Sender user does not exist');
      }

      // Find the pending friend requests from the sender to the user
      const pendingRequest = await this.prisma.friendship.findFirst({
        where: {
          senderId: sender.id,
          receiverId: userId,
          inviteStatus: 'PENDING',
        },
      });

      if (!pendingRequest) {
        throw new Error('No pending friend request found from the specified user.');
      }

      // If the answer is true, update the inviteStatus to 'ACCEPTED'
      if (answer) {
        const updatedFriendship = await this.prisma.friendship.update({
          where: {
            id: pendingRequest.id,
          },
          data: {
            inviteStatus: 'ACCEPTED',
          },
        });

        console.log('Friend request accepted');

		await this.prisma.friendship.create({
			data: {
				senderId: userId,
				receiverId: sender.id,
				inviteStatus: 'ACCEPTED',
			},
		});

        return updatedFriendship;
      } else {
        // If the answer is false, delete the friendship record
        await this.prisma.friendship.delete({
          where: {
            id: pendingRequest.id,
          },
        });

        console.log('Friend request denied');
        // Return a placeholder Friendship object as it's customary to return something even in the case of denial
        return { id: -1, inviteStatus: 'REJECT', senderId: -1, receiverId: -1 };
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  }


//! ############################################################################################################


  async sendFriendInvitation(senderUser: User, userToAdd: string): Promise<Friendship> {
	// Check if the sender and receiver are not the same user
	if (senderUser.pseudo === userToAdd) {
	  throw new Error('You cannot send a friend invitation to yourself');
	}
  
	// Find the sender user
	const sender = await this.prisma.user.findUnique({ where: { id: senderUser.id } });
	if (!sender) {
	  throw new Error('Sender user does not exist');
	}
  
	// Find the receiver user
	const receiver = await this.prisma.user.findUnique({ where: { pseudo: userToAdd } });
  
	if (!receiver) {
	  throw new Error('Receiver user does not exist');
	}
  
	// Check if a friendship request already exists between the sender and receiver
	const existingFriendship = await this.prisma.friendship.findFirst({
	  where: {
		OR: [
		  { senderId: senderUser.id, receiverId: receiver.id },
		  { senderId: receiver.id, receiverId: senderUser.id },
		],
	  },
	});
  
	if (existingFriendship) {
	  throw new Error('A friendship invitation already exists between these users');
	}
  
	const newFriendship = await this.prisma.friendship.create({
	  data: {
		senderId: senderUser.id,
		receiverId: receiver.id,
		inviteStatus: 'PENDING',
	  },
	});

	return newFriendship;
  }

}