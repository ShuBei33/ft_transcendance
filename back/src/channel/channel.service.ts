import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTO_CreateChan, DTO_InviteChan, DTO_JoinChan, DTO_UpdateChan, DTO_UpdateChanUsr, OWNER_USER_CHANNEL } from './dto';
import { Prisma, Channel, ChannelMsg, ChanUsr } from '@prisma/client';
import { ChanUsrRole, UserStatusMSGs, ChanVisibility, StatusInv } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';
import * as bcrypt from 'bcrypt';
import { ChannelCard, ChannelLite } from './dto/channelLite';

const logger = new Logger();

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Creation		                                                                    //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

		async create_channel( userId: number, payload: DTO_CreateChan ) : Promise<ChannelCard>
		{
			const { name, visibility, hash } = payload;
			let BETTERhash: string | undefined;
			if (hash)
				 BETTERhash = await bcrypt.hash(hash, 10);
            const newChannel = await this.prisma.channel.create({
                data: {
                    name,
                    visibility,
                    hash: BETTERhash
                },
				select: {
					id: true,
					name: true,
					visibility:  true,
				}
            });
			this.create_user_channel( 
				userId,
				newChannel.id,
				ChanUsrRole.OWNER,
				UserStatusMSGs.NORMAL,
				StatusInv.ACCEPTED
			)
			return newChannel;
		}


		async create_user_channel( userId: number, chanId: number, role: ChanUsrRole, status: UserStatusMSGs, invitedToChan?: StatusInv ) : Promise<void>
		{
            await this.prisma.chanUsr.create({
                data: {
                    user: { connect: { id: userId } },
                    channel: { connect: { id: chanId } },
                    role,
                    status,
                    invitedToChan
                }
            });
		}

//     //////////////////////////////////////////////////////////////////////////////////////////////
//     //																							//
//     //		Deletion		                                                                    //
//     //																							//
//     //////////////////////////////////////////////////////////////////////////////////////////////

		async delete_channel( chanId: number ) : Promise<void>
		{
			await this.prisma.channel.delete({
				where: { id: chanId },
			})
		}


		async delete_user_channel( userId: number, chanId: number )
		{
			await this.prisma.chanUsr.delete({
				where: { 
				userId_chanId: {
					userId: userId,
					chanId: chanId
				}},
			})
 		}

//     //////////////////////////////////////////////////////////////////////////////////////////////
//     //																							//
//     //		Retriever		                                                                    //
//     //																							//
//     //////////////////////////////////////////////////////////////////////////////////////////////

		async get_visible_channels() : Promise<ChannelCard[]>
		{
			const visibile_channels = await this.prisma.channel.findMany({
				where: {
					NOT: { visibility: 'PRIVATE' },
				},
				select: {
					id: true,
					name: true,
					createdAt: false,
					updatedAt: false,
					visibility: true,
					hash: false
				}
			});
			return visibile_channels;
		}


		async get_channels( userId: number ) : Promise<ChannelLite[]>
		{
            const memberships = await this.prisma.chanUsr.findMany({
                where: {
                    userId: userId,
                    OR: [
                        { invitedToChan: 'ACCEPTED' },
                        { invitedToChan: null },
                    ],
                    NOT: {
                        status: 'BANNED'
                    }
                },
                select: {
					channel: {
						select: {
							id: true,
							name: true,
							visibility: true,
							channelMsgs: true
				} } }
            })
			const channels = memberships.map(membership => membership.channel);
			console.log(channels);
            return channels;
		}

		async isValideChannel( userId: number ) : Promise<boolean>
		{
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
			return true;
		}

		async get_channel( userId: number, chanId: number ) : Promise<ChannelLite>
		{
			const messages = await this.prisma.channel.findFirst({
                where: { id: chanId },
				select: {
					id: true,
					name: true,
					visibility: true,
					channelMsgs: true
				}
            })
            return messages;	
		}

//     //////////////////////////////////////////////////////////////////////////////////////////////
//     //																							//
//     //		Channel traffic		                                                                //
//     //																							//
//     //////////////////////////////////////////////////////////////////////////////////////////////

//     async joinChannel(userId: number, chanId: number, joinChanDto?: DTO_JoinChan): Promise<void> {
//         try {
//             // check that channel exists
//             const channel = await this.prisma.channel.findUniqueOrThrow({
//                 where: { id: chanId },
//             });

//             // check that you are not already a member/have already interacted with it
//             const chanUsr = await this.prisma.chanUsr.findFirst({
//                 where: {
//                     userId,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'ACCEPTED' },
//                         { invitedToChan: 'REJECT' },
//                         { invitedToChan: 'BLOCKED' },
//                     ],
//                 },
//             })
//             if (chanUsr) {
//                 if (chanUsr.invitedToChan == 'REJECT')
//                     error.hasConflict("You have already declined this invitation.");
//                 else if (chanUsr.invitedToChan == 'BLOCKED')
//                     error.hasConflict("You have already blocked this invitation.");
//                 error.hasConflict("You are already a member of this channel.");
//             }
//             switch (channel.visibility) {
//                 case 'PROTECTED':
//                     // check that user provided correct password
//                     const hash = joinChanDto;
//                     if (!await bcrypt.compare(hash, channel.hash))
//                         error.notAuthorized("Password mismatch.");
//                     else
//                         await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
//                     break;
//                 case 'PRIVATE':
//                     // check that user has been invited
//                     const invitation = await this.prisma.chanUsr.findFirst({
//                         where: {
//                             userId,
//                             chanId: chanId,
//                             invitedToChan: 'PENDING'
//                         },
//                     });
//                     if (!invitation)
//                         error.notAuthorized("You have not been invited to this channel.");
//                     else
//                         // we don't recreate a new chanUsr, we just update it
//                         await this.prisma.chanUsr.update({
//                             where: { id: invitation.id },
//                             data: { invitedToChan: 'ACCEPTED' }
//                         });
//                     break;
//                 default:
//                     await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
//                     break;
//             }
//         } catch (e) {
//             if (e instanceof PrismaClientKnownRequestError)
//                 error.notFound("Channel not found.");
//             else if (e instanceof HttpException)
//                 throw e;
//             else
//                 error.unexpected(e)
//         }
//     }

//     async inviteToChannel(userId: number, chanId: number, invitedUser: DTO_InviteChan): Promise<void> {
//         try {
//             // check current user's rights
//             await this.prisma.chanUsr.findFirstOrThrow({
//                 where: {
//                     userId,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'ACCEPTED' },
//                         { invitedToChan: null },
//                     ],
//                     NOT: {
//                         status: 'BANNED'
//                     }
//                 }
//             })
//             // check that invitedUser is not already a member
//             const invited = await this.prisma.chanUsr.findFirst({
//                 where: {
//                     userId: invitedUser.userId,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'PENDING' },
//                         { invitedToChan: 'REJECT' },
//                         { invitedToChan: 'BLOCKED' },
//                         { invitedToChan: 'ACCEPTED' },
//                     ],
//                 },
//             })
//             if (invited) {
//                 if (invited.invitedToChan == 'PENDING') {
//                     error.hasConflict("This person has already been invited.")
//                 }
//                 else if (invited.invitedToChan == 'REJECT') {
//                     error.hasConflict("This person has already refused your invitation.")
//                 }
//                 else if (invited.invitedToChan == 'BLOCKED') {
//                     error.hasConflict("You cannot send invitations to this person.")
//                 }
//                 error.hasConflict("This person is already a member of this channel.");            // if (messages.length === 0) // strict equality operator
//                 //     error.notFound("There aren't any messages at the moment.")
//             }
//             await this.createChanUsr(invitedUser.userId, chanId, 'NORMAL', 'NORMAL', 'PENDING');
//         }
//         catch (e) {
//             if (e instanceof PrismaClientKnownRequestError)
//                 error.notAuthorized("Not admin or owner.");
//             else if (e instanceof PrismaClientValidationError)
//                 error.badRequest("You sent invalid data.");
//             else {
//                 error.unexpected(e);
//             }
//         }
//     }

//     async leaveChannel(userId: number, chanId: number): Promise<void> {
//         try {
//             // check that user is a member of the channel
//             const chanUsr = await this.prisma.chanUsr.findUniqueOrThrow({
//                 where: {
//                     userId_chanId: {
//                         userId: userId,
//                         chanId: chanId
//                     },
//                     // adding this filter to make sure a banned user cannot leave and come back
//                     NOT: {
//                         status: 'BANNED'
//                     }
//                 }
//             });
//             if (chanUsr.role == 'OWNER') // if owner, we delete the whole channel
//                 await this.prisma.channel.delete({
//                     where: { id: chanId },
//                 })
//             else
//                 await this.prisma.chanUsr.delete({
//                     where: { id: userId },
//                 })
//         }
//         catch (e) {
//             if (e instanceof PrismaClientKnownRequestError) {
//                 error.notAuthorized(`This channel is not accessible to you.`);
//             }
//             else
//                 error.unexpected(e)
//         }
//     }

//     //////////////////////////////////////////////////////////////////////////////////////////////
//     //																							//
//     //		Updates	                                                                            //
//     //																							//
//     //////////////////////////////////////////////////////////////////////////////////////////////



//     async updateChannel(userId: number, chanId: number, channelModified: DTO_UpdateChan): Promise<void> {
//         try {
//             // check that the user can access that channel and has the correct rights
//             await this.prisma.chanUsr.findFirstOrThrow({
//                 where: {
//                     userId,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'ACCEPTED' },
//                         { invitedToChan: null },
//                     ],
//                     NOT: {
//                         status: 'BANNED'
//                     },
//                     role: { in: ['ADMIN', 'OWNER'] },
//                 }
//             })
//             // delete hash from the db if switching from protected to public / private
//             if (["PUBLIC", "PRIVATE"].includes(channelModified.visibility))
//                 channelModified.hash = null;
//             if (channelModified.visibility == "PROTECTED" && !channelModified.hash)
//                 error.badRequest("You must provide a password.");
            
//             // handle hash update
//             if (channelModified.hash)
//                 channelModified.hash = await bcrypt.hash(channelModified.hash, 10);
//             await this.prisma.channel.update({
//                 where: {
//                     id: chanId,
//                 },
//                 data: {
//                     ...channelModified,
//                 }
//             })
//             if (!channelModified.name && !channelModified.visibility && !channelModified.hash)
//                 error.notFound("You must provide at least one element.");
//         }
//         catch (e) {
//             if (e instanceof PrismaClientKnownRequestError)
//                 error.notAuthorized("Unauthorized operation.");
//             else if (e instanceof PrismaClientValidationError)
//                 error.badRequest("You sent invalid data.");
//             else if (e instanceof HttpException)
//                 throw e;
//             else
//                 error.unexpected(e);
//         }
//     }





//     async updateChanUsr(userId: number, chanId: number, userToModify: DTO_UpdateChanUsr): Promise<void> {
//             // check that the user can access that channel and has the correct rights
//             await this.prisma.chanUsr.findFirstOrThrow({
//                 where: {
//                     userId,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'ACCEPTED' },
//                         { invitedToChan: null },
//                     ],
//                     NOT: {
//                         status: 'BANNED'
//                     },
//                     role: { in: ['ADMIN', 'OWNER'] },
//                 }
//             })
//             // check the userToModify is not owner of the channel
//             const isUserOwner = await this.prisma.chanUsr.findFirst({
//                 where: {
//                     userId: userToModify.id,
//                     chanId,
//                     OR: [
//                         { invitedToChan: 'ACCEPTED' },
//                         { invitedToChan: null },
//                     ],
//                     role: { in: ['OWNER'] },
//                 }
//             })
//             if (isUserOwner)
//                 error.notAuthorized("You cannot modify a channel owner's status.")
//             await this.prisma.chanUsr.update({
//                 where: {
//                     id: userToModify.id,
//                 },
//                 data: {
//                     ...userToModify,
//                 }
//             })
//             if (!userToModify.role && !userToModify.status)
//                 error.notFound("You must provide at least one element.");
//     }

}
