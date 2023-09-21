import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from '../utils/utils_error';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { UserLite } from './dto';
import { FriendService } from 'src/friend/friend.service';

const logger = new Logger();

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getUserById(
    id: number,
    args?: { select: Prisma.UserSelect } | { include: Prisma.UserInclude },
  ) {
    let query = {
      where: {
        id,
      },
    };
    if (args) {
      const argName = Object.entries(args)[0][0];
      query[argName] = args[argName];
    }
    const user = await this.prisma.user.findUnique(query);
    if (!user) error.notFound(`User with id '${id}' does not exists.`);
    return user;
  }

  // WARNING
  async get_user(userId: number): Promise<UserLite> {
    const user: UserLite = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        pseudo: true,
        status: true,
      }
    });
    return user;
  }

  async updateUserStatus(userId: number, newStatus: UserStatus): Promise<number[]> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status: newStatus,
        },
      });
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
          inviteStatus: {
            equals: "ACCEPTED",
          }
        },
        include: {
          receiver: {
            select: {
              id: true,
              status: true,
            }
          },
          sender: {
            select: {
              id: true,
              status: true,
            }
          },
        },
      });
      const friendShipFiltered = friendShip.filter(value => {
        const otherUserId = value.receiverId == userId ? value.senderId : value.receiverId;
        const otherUser = otherUserId == value.receiverId && value.receiver || value.sender;

        return otherUser.status == UserStatus.ONLINE;
      })
      return friendShipFiltered.map(value => value.receiverId == userId ? value.senderId : value.receiverId);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
