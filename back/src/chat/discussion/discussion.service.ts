import { Injectable } from '@nestjs/common';
import { DTO_SocketDiscMessage } from 'src/sockets/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Discussion, UserStatusMSGs } from '@prisma/client';
import { DTO_ChangeStatusDiscussion, DiscussionLite } from './dto';

@Injectable()
export class DiscussionService {
  constructor(private prisma: PrismaService) {}

  async discussionExist(userId_1: number, userId_2: number) {
    const disccusionExist = await this.prisma.discussion.findFirst({
      where: {
        OR: [
          {
            userId1: userId_1,
            userId2: userId_2,
          },
          {
            userId2: userId_1,
            userId1: userId_2,
          },
        ],
      },
    });
    return disccusionExist;
  }

  async discussionExistOrThrow(userId_1: number, userId_2: number) {
    const disccusionExist = await this.prisma.discussion.findFirstOrThrow({
      where: {
        OR: [
          {
            userId1: userId_1,
            userId2: userId_2,
          },
          {
            userId2: userId_1,
            userId1: userId_2,
          },
        ],
      },
    });
    return disccusionExist;
  }

  async create_discussion(
    userId_1: number,
    userId_2: number,
  ): Promise<Discussion> {
    const newDiscussion = await this.prisma.discussion.create({
      data: {
        user1: { connect: { id: userId_1 } },
        user2: { connect: { id: userId_2 } },
      },
    });
    return newDiscussion;
  }

  async create_discussion_message(
    userId: number,
    payload: DTO_SocketDiscMessage,
  ) {
    const newDiscussionMSG = await this.prisma.discussionMsg.create({
      data: {
        content: payload.message,
        user: { connect: { id: userId } },
        discussion: { connect: { id: payload.discId } },
      },
    });
    return newDiscussionMSG;
  }

  async isValideDiscusion(userId: number, discId: number): Promise<boolean> {
    await this.prisma.discussion.findFirstOrThrow({
      where: {
        id: discId,
        OR: [
          {
            userId1: userId,
            user1Status: UserStatusMSGs.NORMAL,
          },
          {
            userId2: userId,
            user2Status: UserStatusMSGs.NORMAL,
          },
        ],
      },
    });
    return true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							//
  //		GETTER			                                                                    //
  //																							//
  //////////////////////////////////////////////////////////////////////////////////////////////

  async getDiscussions(userId: number): Promise<DiscussionLite[]> {
    const discussions = await this.prisma.discussion.findMany({
      where: {
        OR: [
          {
            userId1: userId,
            user1Status: UserStatusMSGs.NORMAL,
          },
          {
            userId2: userId,
            user2Status: UserStatusMSGs.NORMAL,
          },
        ],
      },
      select: {
        id: true,
        userId1: true,
        userId2: true,
        createdAt: false,
        user1Status: false,
        user2Status: false,
        discussionsMsgs: true,
      },
    });
    return discussions;
  }

  async get_discussion(
    userId: number,
    discId: number,
  ): Promise<DiscussionLite> {
    const discussions = await this.prisma.discussion.findFirst({
      where: {
        id: discId,
        OR: [
          {
            userId1: userId,
            user1Status: UserStatusMSGs.NORMAL,
          },
          {
            userId2: userId,
            user2Status: UserStatusMSGs.NORMAL,
          },
        ],
      },
      select: {
        id: true,
        userId1: true,
        userId2: true,
        createdAt: false,
        user1Status: false,
        user2Status: false,
        discussionsMsgs: true,
      },
    });
    return discussions;
  }

  // WARNING
  async get_discussion_full(
    userId: number,
    discId: number,
  ): Promise<Discussion> {
    const discussions = await this.prisma.discussion.findFirst({
      where: { id: discId, OR: [{ userId1: userId }, { userId2: userId }] },
    });
    return discussions;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							//
  //		Muting / blocking a user		                                                    //
  //																							//
  //////////////////////////////////////////////////////////////////////////////////////////////

  async change_discussion_status(
    userId: number,
    payload: DTO_ChangeStatusDiscussion,
  ): Promise<void> {
    const { restrainedId, discId, userStatus } = payload;
    const isDisc: Discussion = await this.get_discussion_full(userId, discId);
    if (isDisc.userId1 === restrainedId) {
      await this.prisma.discussion.update({
        where: { id: discId },
        data: { user1Status: userStatus },
      });
    } else if (isDisc.userId2 === restrainedId) {
      await this.prisma.discussion.update({
        where: { id: discId },
        data: { user2Status: userStatus },
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							//
  //		Deletion		                                                                    //
  //																							//
  //////////////////////////////////////////////////////////////////////////////////////////////

  async delete_message(userId: number, msgId: number): Promise<void> {
    await this.prisma.discussionMsg.delete({
      where: {
        id: msgId,
        userId: userId,
      },
    });
  }
}
