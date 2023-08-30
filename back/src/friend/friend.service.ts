import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusInv, User } from '@prisma/client';
import { Friendship } from '@prisma/client';
import { UserLite } from 'src/user/dto';
import { Logger } from '@nestjs/common';
import { error } from 'src/utils/utils_error';

const logger = new Logger();

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getFriendsList(userId: number): Promise<User[]> {
    const friendShip = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            senderId: {
              equals: userId,
            },
          },
          {
            receiverId: {
              equals: userId,
            },
          },
        ],
        NOT: {
          inviteStatus: {
            not: StatusInv.ACCEPTED,
          },
        },
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
    if (!friendShip) return [];
    const friends: User[] = friendShip.map(
      (friendship) =>
        (friendship.receiverId != userId && friendship.receiver) ||
        friendship.sender,
    );
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
        throw new Error(
          'Invalid answer format. Use true for accept or false for deny.',
        );
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
        throw new Error(
          'No pending friend request found from the specified user.',
        );
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
        return {
          id: -1,
          inviteStatus: 'REJECT',
          senderId: -1,
          receiverId: -1,
          countResendSndr: 0,
          countResendRcvr: 0,
          senderIsBlocked: false,
          receiverIsBlocked: false,
        };
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  //! ############################################################################################################

  async sendFriendInvitation(
    senderId: number,
    receiverId: number,
  ): Promise<Friendship> {
    const friendShipExists = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: receiverId,
            receiverId: senderId,
          },
          {
            receiverId: receiverId,
            senderId: senderId,
          },
        ],
      },
    });
    if (!friendShipExists)
      return await this.prisma.friendship.create({
        data: {
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
        include: {
          receiver: true,
          sender: true,
        },
      });
    else {
      error.hasConflict('Friend request already sent');
    }
  }
}
