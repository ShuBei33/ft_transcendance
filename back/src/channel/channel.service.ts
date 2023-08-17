import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOCreateChan, DTOInviteChan, DTOJoinChan } from './dto';
import { Prisma, ChanUsr, ChanUsrRole, ChanUsrStatus, ChanVisibility, Channel, StatusInv } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'src/utils_error';

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

    async createChanUsr(userId: number, chanId: number, role: ChanUsrRole, status: ChanUsrStatus, invitedToChan?: StatusInv): Promise<ChanUsr> {
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
        let allChannels;
        return allChannels;
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
                invitedToChan: { in: ['ACCEPTED', null] }
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
            
            const myChannels = myChanUsers.map(chanUsr => chanUsr.channel);
            return myChannels;
        }
        catch (e) {
            error.unexpected('Unexpected error.');
        }
    }


//////////////////////////////////////////////////////////////////////////////////////////////
//																							//
//		Updates		                                                                        //
//																							//
//////////////////////////////////////////////////////////////////////////////////////////////


    async leaveChannel(userId: number, chanId: number): Promise<void> {
        try {
            const chanUsr = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                }
            });
            if (chanUsr.role == 'OWNER')
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
                error.notAuthorized(`Channel ID ${chanId} is not accessible for this user.`);
            }
            else
                error.unexpected('Unexpected error.')
        }
    }
    
    async inviteToChannel(userId: number, chanId: number, invitedUser: DTOInviteChan) {
        try {
            const userHasRights = await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    role: { in: ['ADMIN', 'OWNER'] }
                }
            })
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
            if (e instanceof PrismaClientKnownRequestError) {
                error.notFound(`Channel not found.`);
            } if (e instanceof HttpException)
                throw e;
            else
                error.unexpected('Unexpected error.')
        }
    }
}
