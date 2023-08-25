import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOCreateChan, DTOInviteChan, DTOJoinChan, DTOUpdateChan, DTOChanUsr } from './dto';
import { Prisma, Channel, ChannelMsg, ChanUsr } from '@prisma/client';
import { ChanUsrRole, ChanUsrStatus, ChanVisibility, StatusInv } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
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
                error.unexpected(e);
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
                error.unexpected(e);
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
                error.unexpected(e);
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
            error.unexpected(e);
        }
    }

    async getMyChannels(userId: number): Promise<ChanUsr[]> {
        try {
            // only get channels to which we've subscribed and in which user is not banned
            const memberships = await this.prisma.chanUsr.findMany({
                where: {
                    userId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    }
                }
            })
            if (memberships.length === 0) // strict equality operator
                error.notFound('You haven\'t subscribed to any channels yet.')
            return memberships;
        }
        catch (e) {
            if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    async getChannelMsgs(userId: number, channelId: number): Promise<ChannelMsg[]> {
        try {
            // check user's access to the channel
            await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    }
                }
            })
            const messages = await this.prisma.channelMsg.findMany({
                where: { channelId }
            })
            if (messages.length === 0) // strict equality operator
                error.notFound('There aren\'t any messages at the moment.')
            return messages;
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('You are not allowed to access this channel.')
            else
                if (e instanceof HttpException)
                    throw e;
                else
                    error.unexpected(e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Channel traffic		                                                                //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    async joinChannel(userId: number, chanId: number, joinChanDto?: DTOJoinChan): Promise<void> {
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
            })
            if (chanUsr)
                error.hasConflict('You are already a member / you have already interacted with this channel.');

            switch (channel.visibility) {
                case 'PROTECTED':
                    // check that user provided correct password
                    const { hash } = joinChanDto;
                    if (hash != channel.hash)
                        error.notAuthorized(`Password mismatch.`);
                    else
                        await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
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
                            data: { invitedToChan: 'ACCEPTED' }
                        });
                    break;
                default:
                    await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
            }
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) // you will also have this error if trying to access a private channel without invite
                error.notFound(`Channel not found.`);
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e)
        }
    }

    async inviteToChannel(userId: number, chanId: number, invitedUser: DTOInviteChan): Promise<void> {
        try {
            // check current user's rights
            await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    }
                }
            })
            // check that invitedUser is not already a member
            const invited = await this.prisma.chanUsr.findFirst({
                where: {
                    userId: invitedUser.userId,
                    chanId,
                    OR: [
                        { invitedToChan: 'PENDING' },
                        { invitedToChan: 'REJECT' },
                        { invitedToChan: 'BLOCKED' },
                        { invitedToChan: 'ACCEPTED' },
                    ],
                },
            })
            if (invited) {
                if (invited.invitedToChan == 'PENDING') {
                    error.hasConflict('This person has already been invited.')
                }
                else if (invited.invitedToChan == 'REJECT') {
                    error.hasConflict('This person has already refused your invitation.')
                }
                else if (invited.invitedToChan == 'BLOCKED') {
                    error.hasConflict('You cannot send invitations to this person.')
                }
                error.hasConflict('This person is already a member of this channel.');
            }
            await this.createChanUsr(invitedUser.userId, chanId, 'NORMAL', 'NORMAL', 'PENDING');
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("Not admin or owner.");
            else {
                error.unexpected(e);
            }
        }
    }

    async leaveChannel(userId: number, chanId: number): Promise<void> {
        try {
            // check that user is a member of the channel
            const chanUsr = await this.prisma.chanUsr.findUniqueOrThrow({
            where: {
                userId_chanId: { userId: userId,
                                 chanId: chanId }
                }
            });
            if (chanUsr.role == 'OWNER') // if owner, we delete the whole channel
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
                error.unexpected(e)
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
            error.unexpected(e + ' Unexpected error while updating channel name.');
        }
    }

    private async set_chanPassword(chanId: number, hash: string) {
        try {
            await this.prisma.channel.update({
                where: { id: chanId },
                data: { hash }
            });
        } catch (e) {
            error.unexpected(e + ' Unexpected error while updating channel password.');
        }
    }

    private async set_chanVisibility(chanId: number, visibility: ChanVisibility) {
        try {
            await this.prisma.channel.update({
                where: { id: chanId },
                data: { visibility }
            });
        } catch (e) {
            error.unexpected(e + ' Unexpected error while updating channel visibility.');
        }
    }

    async updateChannel(userId: number, chanId: number, channelModified: DTOUpdateChan): Promise<void> {
        try {
            // check that the user can access that channel and has the correct rights
            await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    },
                    role: { in: ['ADMIN', 'OWNER'] },
                }
            })
            // call appropriate functions if user provided element
            if (channelModified.name)
                await this.set_chanName(chanId, channelModified.name);
            if (channelModified.visibility)
                await this.set_chanVisibility(chanId, channelModified.visibility);
            if (channelModified.hash)
                await this.set_chanPassword(chanId, channelModified.hash);
            if (!channelModified.name && !channelModified.visibility && !channelModified.hash)
                error.notFound('You must provide at least one element.');
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Channel User privileges and status	                                                //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    private async set_chanUsrRole(userToModify: DTOChanUsr) {
        try {
            await this.prisma.chanUsr.update({
                where: { id: userToModify.id },
                data: { role: userToModify.role }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else if (e instanceof PrismaClientValidationError)
                error.notFound('Channel User not found.');
            else
                error.unexpected(e + ' Unexpected error while updating user role.');
        }
    }

    private async set_chanUsrStatus(userToModify: DTOChanUsr) {
        try {
            await this.prisma.chanUsr.update({
                where: { id: userToModify.id },
                data: {
                    status: userToModify.status,
                    statusDuration: userToModify.statusDuration
                }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else if (e instanceof PrismaClientValidationError)
                error.notFound('Channel User not found.');
            else
                error.unexpected(e + ' Unexpected error while updating user status.');
        }
    }

    async updateChanUsr(userId: number, chanId: number, userToModify: DTOChanUsr): Promise<void> {
        try {
            // check that the user can access that channel and has the correct rights
            await this.prisma.chanUsr.findFirstOrThrow({
                where: {
                    userId,
                    chanId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    },
                    role: { in: ['ADMIN', 'OWNER'] },
                }
            })
            // call appropriate functions if user provided element
            if (userToModify.role)
                await this.set_chanUsrRole(userToModify);
            if (userToModify.status)
                await this.set_chanUsrStatus(userToModify);
            if (!userToModify.role && !userToModify.status)
                error.notFound('You must provide at least one element.');
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('Unauthorized operation.');
            else if (e instanceof PrismaClientValidationError)
                error.notFound('Channel User not found.');
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }
}
