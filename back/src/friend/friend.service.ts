import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusInv, User } from '@prisma/client';
import { Friendship } from '@prisma/client';
import { UserLite } from 'src/user/dto';
import { Logger } from '@nestjs/common';
import { error } from 'src/utils/utils_error';
import { DiscussionService } from 'src/chat/discussion/discussion.service';
import { userLite } from 'src/utils/safeUser';

const logger = new Logger();
@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService, private dm: DiscussionService) { }

  async getFriendsList(userId: number, status: StatusInv, filterUser: boolean) {
    // TODO sender receiver safe user
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
            not: status,
          },
        },
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
    if (!friendShip) return [];

    if (filterUser) {
      const friends = friendShip.map((friendship) => {
        if (friendship.receiverId != userId) return friendship.receiver;
        return friendship.sender;
      });
      return friends;
    } else {
      return friendShip;
    }
  }

  async deleteFriend(userId: number, friendId: number) {
    if (userId === friendId)
      error.hasConflict('You cannot delete yourself');
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

    if (!friendship)
      error.notFound("Friendship does not exist");

    // Delete the friendship
    return await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });
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
    receiverId: number,
    friendShipId: number,
  ): Promise<Friendship> {
    const updatedFriendShip = await this.prisma.friendship.update({
      where: {
        id: friendShipId,
      },
      data: {
        inviteStatus: StatusInv.ACCEPTED,
      },
      include: {
        receiver: {
          select: {
            ...userLite
          },
        },
        sender: {
          select: {
            ...userLite
          },
        }
      }
    });

    if (updatedFriendShip) {
      const discussionExist = await this.dm.discussionExist(
        updatedFriendShip.receiverId,
        updatedFriendShip.senderId,
      );
      if (!discussionExist) {
        const dmRoom = await this.dm.create_discussion(
          updatedFriendShip.receiverId,
          updatedFriendShip.senderId,
        );
      }
    }

    return updatedFriendShip;
  }

  async deleteFriendShip(
    receiverId: number,
    friendShipId: number,
  ): Promise<Friendship> {
    const deletedFriendShip = await this.prisma.friendship.delete({
      where: {
        id: friendShipId,
      },
    });

    deletedFriendShip.inviteStatus = StatusInv.REJECT;
    return deletedFriendShip;
  }

  async declineFriendShip(
    receiverId: number,
    friendShipId: number,
  ): Promise<Friendship> {
    const friendShip = await this.prisma.friendship.findUnique({
      where: {
        id: friendShipId,
      },
    });

    if (friendShip && friendShip.inviteStatus == 'ACCEPTED')
      error.hasConflict('Already friends.');
    return await this.deleteFriendShip(receiverId, friendShipId);
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
