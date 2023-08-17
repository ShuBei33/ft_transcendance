import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOCreateChan, DTOInviteChan, DTOJoinChan } from './dto';
import { ChanUsr, ChanUsrRole, ChanUsrStatus, Channel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'src/error_utils';

const logger = new Logger();

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createChanUsr(userId: number, chanId: number, role: ChanUsrRole, status: ChanUsrStatus, isConfirmed: boolean = true): Promise<ChanUsr> {
        try {
            const newChanUsr = await this.prisma.chanUsr.create({
                data: {
                    user: { connect: { id: userId } },
                    channel: { connect: { id: chanId } },
                    role,
                    status,
                    isConfirmed
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

    async createChannel(userId: number, myChanDto: DTOCreateChan): Promise<Channel> {
        try {
            const { name, visibility } = myChanDto;
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
                error.hasConflict(`Channel ${myChanDto.name} already exists.`);
            } else
                error.unexpected('Unexpected error.')
        }
    }

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

    async joinChannel(userId: number, chanId: number, myChanDto: DTOJoinChan): Promise<void> {
        try {
            const { hash } = myChanDto;

            const channel = await this.prisma.channel.findUniqueOrThrow({
                where: { id: chanId },
            });
            switch (channel.visibility) {
                case 'PUBLIC':
                    await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
                case 'PROTECTED':
                    if (hash != channel.hash)
                        error.notAuthorized(`Password mismatch.`);
                    else
                        await this.createChanUsr(userId, chanId, 'NORMAL', 'NORMAL');
                    break;
                default:
                    error.notAuthorized(`You have not been invited to this channel.`);
            }
            // if (channel.visibility == 'PROTECTED') {
            //     if (channel.hash != hash)
            //         await this.prisma.chanUsr.delete( {
            //             where: { id: newChanUsr.id}
            //         })
            //         error.notAuthorized(`Password mismatch.`);
            // }
            // else if (channel.visibility == 'PRIVATE') {
            //     if (invited == false) {
            //         await this.prisma.chanUsr.delete( {
            //             where: { id: newChanUsr.id}
            //         })
            //         error.notAuthorized(`You have not been invited to this channel.`);
            //     }
            // const newChanUsr = await this.createChanUsr(userId, id, 'NORMAL', 'NORMAL');
            // }
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.notFound(`Channel not found.`);
            } if (e instanceof HttpException)
                throw e;
            else
                error.unexpected('Unexpected error.')
        }
    }
    
    async inviteToChannel(userId: number, chanId: number, userToInviteId: DTOInviteChan) {
        const userHasRights = await this.prisma.chanUsr.findFirst({
            where: {
                userId,
                chanId,
                role: {
                    in: ['ADMIN', 'OWNER']
                }
            }
        })
        if (!userHasRights) {
            error.notAuthorized("Not admin or owner.");
        } else {
            const chanUsr = await this.createChanUsr(userToInviteId.userId, chanId, 'NORMAL', 'NORMAL', false);
            logger.log(chanUsr);
        }
        
    }
}
