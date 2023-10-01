import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DTO_CreateChan,
  DTO_InviteChan,
  DTO_JoinChan,
  DTO_CreateMessage,
} from './dto';
import { ChannelLite } from './dto/channelLite';
import { ChannelMsg, ChanUsr } from '@prisma/client';
import { ChanUsrRole, UserStatusMSGs, StatusInv } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';
import * as bcrypt from 'bcrypt';
import { userLite } from 'src/utils/safeUser';

const logger = new Logger();

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							                                            //
  //		Creation		                                                                          //
  //																							                                            //
  //////////////////////////////////////////////////////////////////////////////////////////////

  async createMessage(data: DTO_CreateMessage) {
    return await this.prisma.channelMsg.create({ data });
  }

  async createChanUsr(
    userId: number,
    chanId: number,
    role: ChanUsrRole,
    status: UserStatusMSGs,
    invitedToChan?: StatusInv,
  ): Promise<ChanUsr> | null {
    try {
      const newChanUsr = await this.prisma.chanUsr.create({
        data: {
          user: { connect: { id: userId } },
          channel: { connect: { id: chanId } },
          role,
          status,
          invitedToChan,
        },
      });
      return newChanUsr;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        error.hasConflict('Channel user already exists.');
      else error.unexpected(e);
    }
  }

  async createChannel(
    userId: number,
    newChanDto: DTO_CreateChan,
  ): Promise<ChannelLite> | null {
    const { name, visibility, password } = newChanDto;
    let optionalHash = null;

    // handle protected case with hash
    if (visibility == 'PROTECTED') {
      if (!password) error.badRequest('You must provide a password.');
      else
        optionalHash = await bcrypt.hash(
          password,
          Number(process.env.HASH_SALT_ROUND),
        );
    }
    const newChannel = await this.prisma.channel.create({
      data: {
        name,
        visibility,
        hash: optionalHash,
      },
      include: {
        // doesn't matter if it's empty at creation, front needs it
        channelUsers: true,
        channelMsgs: true,
      },
    });
    await this.createChanUsr(userId, newChannel.id, 'OWNER', 'NORMAL');
    // return channel without hash
    const { hash, ...rest } = newChannel;
    return rest;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																		                                                      //
  //		Deletion		                                                                          //
  //																							                                            //
  //////////////////////////////////////////////////////////////////////////////////////////////

  async deleteChannel(userId: number, chanId: number): Promise<void> {
    try {
      const chanUsr = await this.prisma.chanUsr.findFirstOrThrow({
        where: {
          userId,
          chanId,
          role: 'OWNER',
        },
      });
      await this.prisma.channel.delete({
        where: { id: chanId },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        error.notAuthorized('This channel is not accessible to this user.');
      } else error.unexpected(e);
    }
  }

  // WARNING
  async removeChannel(chanId: number) {
    await this.prisma.channel.delete({ where: { id: chanId } });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							//
  //		Retriever		                                                                    //
  //																							//
  //////////////////////////////////////////////////////////////////////////////////////////////

  async getAllChannels(): Promise<ChannelLite[]> | null {
    // only get PUBLIC and PROTECTED channels
    const nonPrivChannels = await this.prisma.channel.findMany({
      where: {
        NOT: { visibility: 'PRIVATE' },
      },
      include: {
        channelUsers: {
          include: {
            user: {
              select: userLite,
            },
          },
        },
      },
    });
    // returns them with minimal infos
    const liteChannels: ChannelLite[] = nonPrivChannels.map((channel) => {
      const { createdAt, updatedAt, hash, ...rest } = channel;
      return rest;
    });
    return liteChannels;
  }

  async getMyChannels(userId: number): Promise<ChanUsr[]> {
    // only get channels to which we've subscribed and in which user is not banned
    const memberships = await this.prisma.chanUsr.findMany({
      where: {
        userId,
        OR: [{ invitedToChan: 'ACCEPTED' }, { invitedToChan: null }],
        NOT: { status: 'BANNED' },
      },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            visibility: true,
            channelUsers: {
              include: {
                user: {
                  select: userLite,
                },
              },
            },
          },
        },
      },
    });
    return memberships;
  }

  async getChannelMsgs(
    userId: number,
    channelId: number,
  ): Promise<ChannelMsg[]> | null {
    // check user's access to the channel
    await this.prisma.chanUsr.findFirstOrThrow({
      where: {
        userId,
        chanId: channelId,
        OR: [{ invitedToChan: 'ACCEPTED' }, { invitedToChan: null }],
        NOT: { status: 'BANNED' },
      },
    });
    const messages = await this.prisma.channelMsg.findMany({
      where: { channelId },
    });
    return messages;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							                                            //
  //		Channel traffic		                                                                    //
  //																							                                            //
  //////////////////////////////////////////////////////////////////////////////////////////////

  async joinChannel(
    userId: number,
    chanId: number,
    joinChanDto?: DTO_JoinChan,
  ): Promise<void> {
    try {
      // check that channel exists
      const channel = await this.prisma.channel.findUniqueOrThrow({
        where: { id: chanId },
      });

      // check that you are not already a member/have already interacted with it
      const chanUsr = await this.prisma.chanUsr.findFirst({
        where: {
          userId,
          chanId,
          OR: [
            { invitedToChan: 'ACCEPTED' },
            { invitedToChan: 'REJECT' },
            { invitedToChan: 'BLOCKED' },
          ],
        },
      });
      if (chanUsr) {
        if (chanUsr.invitedToChan == 'REJECT')
          error.hasConflict('You have already declined this invitation.');
        else if (chanUsr.invitedToChan == 'BLOCKED')
          error.hasConflict('You have already blocked this invitation.');
        error.hasConflict('You are already a member of this channel.');
      }
      switch (channel.visibility) {
        case 'PROTECTED':
          // check that user provided correct password
          const { password } = joinChanDto;
          const HashIsValid = await bcrypt.compare(password, channel.hash);
          if (!HashIsValid) {
            logger.warn('Hash error', password);
            error.notAuthorized('Password mismatch.');
          } else {
            logger.warn('Hash Okkkk', password);
            await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
          }
          break;
        case 'PRIVATE':
          // check that user has been invited
          const invitation = await this.prisma.chanUsr.findFirst({
            where: {
              userId,
              chanId: chanId,
              invitedToChan: 'PENDING',
            },
          });
          if (!invitation)
            error.notAuthorized('You have not been invited to this channel.');
          // we don't recreate a new chanUsr, we just update it
          else
            await this.prisma.chanUsr.update({
              where: { id: invitation.id },
              data: { invitedToChan: 'ACCEPTED' },
            });
          break;
        default:
          await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
          break;
      }
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        error.notFound('Channel not found.');
      else if (e instanceof HttpException) throw e;
      else error.unexpected(e);
    }
  }

  async inviteToChannel(
    userId: number,
    chanId: number,
    invitedUser: DTO_InviteChan,
  ): Promise<void> {
    // check that invitedUser is not already a member
    const invited = await this.prisma.chanUsr.findFirst({
      where: {
        userId: invitedUser.userId,
        chanId,
      },
    });
    if (invited) {
      if (invited.invitedToChan == 'PENDING')
        error.hasConflict('This person has already been invited.');
      else if (invited.invitedToChan == 'REJECT')
        error.hasConflict('This person has already refused your invitation.');
      else if (invited.invitedToChan == 'BLOCKED')
        error.hasConflict('You cannot send invitations to this person.');
      error.hasConflict('This person is already a member of this channel.');
    }
    await this.createChanUsr(
      invitedUser.userId,
      chanId,
      'NORMAL',
      'NORMAL',
      'PENDING',
    );
  }

  async leaveChannel(userId: number, chanId: number): Promise<void> {
    try {
      const chanUsr = await this.prisma.chanUsr.findUniqueOrThrow({
        where: {
          userId_chanId: {
            userId: userId,
            chanId: chanId,
          },
          NOT: { status: 'BANNED' },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        error.notAuthorized('Not admin or owner.');
    }
    await this.prisma.chanUsr.delete({ where: { id: userId } });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //																							                                            //
  //		Utils Back		                                                                        //
  //																						                                            	//
  //////////////////////////////////////////////////////////////////////////////////////////////

  async getChanUsr(userId: number, chanId: number): Promise<ChanUsr> | null {
    try {
      // check that the chanUsr exists
      const requestedChanUsr = await this.prisma.chanUsr.findUniqueOrThrow({
        where: {
          userId_chanId: {
            userId: userId,
            chanId: chanId,
          },
        },
      });
      // return a chanUsr with all the info related to it
      return requestedChanUsr;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        error.notFound('Channel User not found.');
      else error.unexpected(e);
    }
  }

  async get_channel(chanId: number): Promise<ChannelLite> {
    const channel: ChannelLite = await this.prisma.channel.findFirst({
      where: { id: chanId },
    });
    return channel;
  }
}
