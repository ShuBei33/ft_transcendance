import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOCreateChan, DTOInviteChan, DTOJoinChan, DTOUpdateChan, DTOUpdateChanUsr } from './dto';
import { Prisma, Channel, ChannelMsg, ChanUsr } from '@prisma/client';
import { ChanUsrRole, UserStatusMSGs, ChanVisibility, StatusInv } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';
import * as bcrypt from 'bcrypt';
import { ChannelLite } from './dto/channelLite';

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

    async createChanUsr(userId: number, chanId: number, role: ChanUsrRole, status: UserStatusMSGs, invitedToChan?: StatusInv): Promise<ChanUsr> | null {
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
                error.hasConflict("Channel user already exists.");
            } else
                error.unexpected(e);
        }
    }

    async createChannel(userId: number, newChanDto: DTOCreateChan): Promise<ChannelLite> | null {
        try {
            const { name, visibility, DTOhash } = newChanDto;
            
            // check that DTO data is correct
            if (visibility == 'PROTECTED')
                if (!DTOhash)
                    error.badRequest('You must provide a password.');
            const newChannel = await this.prisma.channel.create({
                data: {
                    name,
                    visibility,
                    hash: DTOhash
                }
            });
            // hash pwd if provided
            if (DTOhash)
                newChannel.hash = await bcrypt.hash(DTOhash, 10);

            await this.createChanUsr(userId, newChannel.id, 'OWNER', 'NORMAL');
            // return channel without hash
			const { hash, ...rest } = newChannel;
            return rest;

        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.hasConflict("Channel already exists.");
            else if (e instanceof HttpException)
                throw e;
            else
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
            await this.prisma.channel.delete({
                where: { id: chanId },
            })
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.notAuthorized("This channel is not accessible to this user.");
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

    async getAllChannels(): Promise<ChannelLite[]> | null {
        try {
            const nonPrivChannels = await this.prisma.channel.findMany({
                where: {
                    NOT: { visibility: 'PRIVATE' },
             },
            });
            const liteChannels: ChannelLite[] = nonPrivChannels.map(channel => {
                const { createdAt, updatedAt, hash, ...rest } = channel;
                return rest;
            });
            return liteChannels;
        }
        catch (e) {
            error.unexpected(e);
        }
    }

    async getMyChannels(userId: number): Promise<ChanUsr[]> | null {
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
                },
                include: { channel: { select: {
                                                id: true,
                                                name: true,
                                                visibility: true, } } }
            })
            return memberships;
        }
        catch (e) {
            error.unexpected(e);
        }
    }

    async getChannelMsgs(userId: number, channelId: number): Promise<ChannelMsg[]> | null {
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
            return messages;
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("You are not allowed to access this channel.")
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
            if (chanUsr) {
                if (chanUsr.invitedToChan == 'REJECT')
                    error.hasConflict("You have already declined this invitation.");
                else if (chanUsr.invitedToChan == 'BLOCKED')
                    error.hasConflict("You have already blocked this invitation.");
                error.hasConflict("You are already a member of this channel.");
            }
            switch (channel.visibility) {
                case 'PROTECTED':
                    // check that user provided correct password
                    const hash = joinChanDto;
                    if (!await bcrypt.compare(hash, channel.hash))
                        error.notAuthorized("Password mismatch.");
                    else
                        await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
                case 'PRIVATE':
                    // check that user has been invited
                    const invitation = await this.prisma.chanUsr.findFirst({
                        where: {
                            userId,
                            chanId: chanId,
                            invitedToChan: 'PENDING'
                        },
                    });
                    if (!invitation)
                        error.notAuthorized("You have not been invited to this channel.");
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
            if (e instanceof PrismaClientKnownRequestError)
                error.notFound("Channel not found.");
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
                    error.hasConflict("This person has already been invited.")
                }
                else if (invited.invitedToChan == 'REJECT') {
                    error.hasConflict("This person has already refused your invitation.")
                }
                else if (invited.invitedToChan == 'BLOCKED') {
                    error.hasConflict("You cannot send invitations to this person.")
                }
                error.hasConflict("This person is already a member of this channel.");            // if (messages.length === 0) // strict equality operator
                //     error.notFound("There aren't any messages at the moment.")
            }
            await this.createChanUsr(invitedUser.userId, chanId, 'NORMAL', 'NORMAL', 'PENDING');
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("Not admin or owner.");
            else if (e instanceof PrismaClientValidationError)
                error.badRequest("You sent invalid data.");
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
                    userId_chanId: {
                        userId: userId,
                        chanId: chanId
                    },
                    // adding this filter to make sure a banned user cannot leave and come back
                    NOT: {
                        status: 'BANNED'
                    }
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
    //		Updates	                                                                            //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

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
            // delete hash from the db if switching from protected to public / private
            if (["PUBLIC", "PRIVATE"].includes(channelModified.visibility))
                channelModified.hash = null;
            if (channelModified.visibility == "PROTECTED" && !channelModified.hash)
                error.badRequest("You must provide a password.");
            
            // handle hash update
            if (channelModified.hash)
                channelModified.hash = await bcrypt.hash(channelModified.hash, 10);
            await this.prisma.channel.update({
                where: {
                    id: chanId,
                },
                data: {
                    ...channelModified,
                }
            })
            if (!channelModified.name && !channelModified.visibility && !channelModified.hash)
                error.notFound("You must provide at least one element.");
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("Unauthorized operation.");
            else if (e instanceof PrismaClientValidationError)
                error.badRequest("You sent invalid data.");
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    async updateChanUsr(userId: number, chanId: number, userToModify: DTOUpdateChanUsr): Promise<void> {
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
            // check the userToModify is not owner of the channel
            const isUserOwner = await this.prisma.chanUsr.findFirst({
                where: {
                    userId: userToModify.id,
                    chanId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    role: { in: ['OWNER'] },
                }
            })
            if (isUserOwner)
                error.notAuthorized("You cannot modify a channel owner's status.")
            await this.prisma.chanUsr.update({
                where: {
                    id: userToModify.id,
                },
                data: {
                    ...userToModify,
                }
            })
            if (!userToModify.role && !userToModify.status)
                error.notFound("You must provide at least one element.");
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized("Unauthorized operation.");
            else if (e instanceof PrismaClientValidationError)
                error.badRequest("You did not send the correct information.");
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Utils Back		                                                                    //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    // These functions do not have controllers yet

    async getChanUsr(userId: number, chanId: number): Promise<ChanUsr> | null {
        try {
            // check that the chanUsr exists
            const requestedChanUsr = await this.prisma.chanUsr.findUniqueOrThrow({
                where: {
                    userId_chanId: {
                        userId: userId,
                        chanId: chanId
                    }
                }
            });
            // return a chanUsr with all the info related to it
            return requestedChanUsr;
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notFound("Channel User not found.");
            else
                error.unexpected(e);
        }
    }

}
