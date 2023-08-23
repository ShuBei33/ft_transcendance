import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getFriendsList(userId: number) : Promise<User[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentInvites: {
          where: { inviteStatus: 'ACCEPTED' }, // Filter for accepted friend requests
          include: { receiver: true },
        },
        receivedInvites: {
          where: { inviteStatus: 'ACCEPTED' }, // Filter for accepted friend requests
          include: { sender: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Combine sent and received friend requests into a single array
    const friends = [
      ...user.sentInvites.map((invite) => invite.receiver),
    //   ...user.receivedInvites.map((invite) => invite.sender),
    ];

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
}