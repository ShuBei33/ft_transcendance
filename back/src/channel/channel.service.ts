import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOCreateChan, DTOInviteChan, DTOJoinChan, DTOUpdateChan, DTOChanUsr  } from './dto';
import { Prisma, Channel, ChannelMsg, ChanUsr } from '@prisma/client';
import { ChanUsrRole, ChanUsrStatus, ChanVisibility, StatusInv } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';

const logger = new Logger();

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) { }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Creation		                                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////

    private async createChanUsr(userId: number, chanId: number, role: ChanUsrRole, status: ChanUsrStatus, invitedToChan?: StatusInv): Promise<ChanUsr> {
        try {
            const newChanUsr = await this.prisma.chanUsr.create({
                data: {
                    user: { connect: { id: userId } },
                    channel: { connect: { id: chanId } },
                    role,
                    status,
                    invitedToChan
                }
            });
            return newChanUsr;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.hasConflict(`User with userId '${userId}' already exists in channel '${chanId}'.`);
            } else
                error.unexpected('Unexpected error.')
        }
    }

    async createChannel(userId: number, newChanDto: DTOCreateChan): Promise<Channel> {
        try {
            const { name, visibility } = newChanDto;
            const newChannel = await this.prisma.channel.create({
                data: {
                    name,
                    visibility,
                }
            });
            await this.createChanUsr(userId, newChannel.id, 'OWNER', 'NORMAL');

            return newChannel;

        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.hasConflict(`Channel ${newChanDto.name} already exists.`);
            } else
                error.unexpected('Unexpected error.')
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Deletion		                                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////

    async deleteChannel(userId: number, chanId: number): Promise<void> {
        try {
            const chanUsr = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    role: 'OWNER',
                }
            });
            // await this.prisma.channelMsg.deleteMany({ NOT SURE IF NEEDED
            //     where: { channelId: chanId }
            // })
            // await this.prisma.chanUsr.deleteMany({
            //     where: { chanId: chanId }
            // })
            await this.prisma.channel.delete({
                where: { id: chanId },
            })
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.notAuthorized(`Channel ID ${chanId} is not accessible for this user.`);
            }
            else
                error.unexpected('Unexpected error.')
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Retriever		                                                                    //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////

    async getAllChannels(): Promise<Channel[]> {
        try {
            const nonPrivateChannels = await this.prisma.channel.findMany({
                where: {
                    NOT: { visibility: 'PRIVATE' },
                }
            });
            return nonPrivateChannels;
        }
        catch (e) {
            error.unexpected('Unexpected error.');
        }
    }

    async getMyChannels(userId: number, visibility?: ChanVisibility, role?: ChanUsrRole): Promise<Channel[]> {
        try {
            // using a whereclause to handle options, if provided
            let whereClause: Prisma.ChanUsrWhereInput = {
                userId,
                invitedToChan: { in: ['ACCEPTED', null], },
                NOT: { status: 'BANNED' }
              };
            
            if (visibility) {
                whereClause = {
                    ...whereClause,
                    channel: { visibility }
                };
            }
            if (role) {
                whereClause = {
                    ...whereClause,
                    role
                };
            }
            // retrieve all of our channelMemberships 
            const myChanUsers = await this.prisma.chanUsr.findMany({
                where: whereClause,
                include: {
                      channel: true,
                    },
                });
            if (myChanUsers.length === 0) // strict equality operator
                error.notFound('You haven\'t subscribed to any channels yet.')
        
            const myChannels = myChanUsers.map(chanUsr => chanUsr.channel);
            return myChannels;
        }
        catch (e) {
            if (e instanceof HttpException)
                throw e;
            else
                error.unexpected('Unexpected error.');
        }
    }

    async getChannelMsgs(userId: number, chanId: number): Promise<ChannelMsg[]> {
        try {
            // check that the user can access that channel
            const hasAccess = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    invitedToChan: { in: ['ACCEPTED', null] },
                    NOT: { status: 'BANNED'}
                },
            });
            
            const myChannelMsgs = await this.prisma.channelMsg.findMany( {
                where: { channelId: chanId }
            });
            return myChannelMsgs;
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('You do not have access to this channel.');
            else
                error.unexpected('Unexpected error.');
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Channel traffic		                                                                //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////
    
    async inviteToChannel(userId: number, chanId: number, invitedUser: DTOInviteChan): Promise<void> {
        try {
            // check current's users rights
            const userHasRights = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    role: { in: ['ADMIN', 'OWNER'] },
                    NOT: { status: 'BANNED'}

                }
            })
            // check if there is already a friendship 
            const areFriends = await this.prisma.friendship.findFirst({
                where: {
                    AND: [
                        { senderId: userId },
                        { receiverId: invitedUser.userId },
                        { inviteStatus: 'ACCEPTED' },
                    ]
                }
            })
            if (!areFriends)
                error.notFound('You can only send an invitation to a friend.');
            
            const chanUsr = await this.createChanUsr(invitedUser.userId, chanId, 'NORMAL', 'NORMAL', 'PENDING');
        } 
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("Not admin or owner.");
            else if (e instanceof HttpException)
                throw e;
            else {
                error.unexpected('Unexpected error.');
            }
        }
    }

    async joinChannel(userId: number, chanId: number, joinChanDto?: DTOJoinChan): Promise<void> {
        try {
            // check that channel exists
            const channel = await this.prisma.channel.findUniqueOrThrow({
                where: { id: chanId },
            });

            // check that you are not already in the channel
            const chanUsr = await this.prisma.chanUsr.findFirst({
                where: { userId,
                         chanId },
            })
            if (chanUsr)
                error.hasConflict('You are already a member of this channel.')

            switch (channel.visibility) {
                case 'PROTECTED':
                    const { hash } = joinChanDto;
                    if (hash != channel.hash)
                        error.notAuthorized(`Password mismatch.`);
                case 'PRIVATE':
                    // check that user has been invited
                    const invitation = await this.prisma.chanUsr.findFirstOrThrow({
                        where: {
                            userId,
                            chanId: chanId,
                            invitedToChan: 'PENDING'
                        },       
                    });
                    if (!invitation)
                        error.notAuthorized(`You have not been invited to this channel.`);
                    else
                        // we don't recreate a new chanUsr, we just update it
                        await this.prisma.chanUsr.update({
                            where: { id: invitation.id },
                            data: { invitedToChan: 'ACCEPTED'}
                    });
                break;
                default:
                    await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
                }
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notFound(`Channel not found.`);
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected('Unexpected error.')
        }
    }

    async leaveChannel(userId: number, chanId: number): Promise<void> {
        try {
            const chanUsr = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                }
            });
            if (chanUsr.role == 'OWNER') // if Owner, we delete the whole channel. Must check on-cascade deletion in prisma.
                await this.prisma.channel.delete({
                    where: { id: chanId },
                })
            else
                await this.prisma.chanUsr.delete({
                    where: { id: userId },
                })
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.notAuthorized(`This channel is not accessible to you.`);
            }
            else
                error.unexpected('Unexpected error.')
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Channel settings	                                                                //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////

    private async set_chanName(chanId: number, name: string) {
        try {
            await this.prisma.channel.update({
                where: { id: chanId },
                data: { name }
            });
          } catch (e) {
            error.unexpected('Unexpected error while updating channel name.');
        }
    }

    private async set_chanPassword(chanId: number, hash: string) {
        try {
            await this.prisma.channel.update({
                where: { id: chanId },
                data: { hash }
            });
          } catch (e) {
            error.unexpected('Unexpected error while updating channel password.');
        }
    }

    private async set_chanVisibility(chanId: number, visibility: ChanVisibility) {
        try {
            await this.prisma.channel.update({
                where: { id: chanId },
                data: { visibility }
            });
          } catch (e) {
            error.unexpected('Unexpected error while updating channel visibility.');
        }
    }

    async updateChannel(userId: number, chanId: number, channelModified: DTOUpdateChan ): Promise<void> {
        try {
            // check that the user can access that channel
            const hasAccess = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    invitedToChan: { in: ['ACCEPTED', null] },
                    NOT: { status: 'BANNED'}
                },
            });

            // check the user's rights
            const userRights = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                  userId,
                  chanId,
                  role: { in: ['ADMIN', 'OWNER'] },
                },
              });

            // call appropriate functions if user provided element
            if (channelModified.name)
                await this.set_chanName(chanId, channelModified.name);
            if (channelModified.visibility)
                await this.set_chanVisibility(chanId, channelModified.visibility);
            if (channelModified.hash)
                await this.set_chanPassword(chanId, channelModified.hash);            
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else
                error.unexpected('Unexpected error.');
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Channel User privileges and status	                                                //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////

    private async set_chanUsrRole(userToModify: DTOChanUsr ) {
        try {
            await this.prisma.chanUsr.update({
                where: { id: userToModify.id},
                data: { role: userToModify.role }
            });
          } catch (e) {
            error.unexpected('Unexpected error while updating user role.');
        }
    }

    private async set_chanUsrStatus(userToModify: DTOChanUsr ) {
        try {
            await this.prisma.chanUsr.update({
                where: { id: userToModify.id},
                data: { status: userToModify.status,
                        statusDuration: userToModify.statusDuration }
            });
          } catch (e) {
            error.unexpected('Unexpected error while updating user status.');
        }
    }

    async updateChanUsr(userId: number, chanId: number, userToModify: DTOChanUsr ): Promise<void> {
        try {
            // check that the user can access that channel
            const hasAccess = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    invitedToChan: { in: ['ACCEPTED', null] },
                    NOT: { status: 'BANNED'}
                },
            });
            // check the user's rights
            const userRights = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                  userId,
                  chanId,
                  role: { in: ['ADMIN', 'OWNER'] },
                },
              });
            
            // call appropriate functions if user provided element
            if (userToModify.role)
                await this.set_chanUsrRole(userToModify);
            if (userToModify.status)
                await this.set_chanUsrStatus(userToModify);
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else
                error.unexpected('Unexpected error.');
        }
    }
}
