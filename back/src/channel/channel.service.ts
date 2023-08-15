import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FTChannel } from './dto';
import { ChanUsr, ChanUsrRole, ChanUsrStatus, Channel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'src/error_utils';
const logger = new Logger();
@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createChanUsr(userId: number, chanId: number, role: ChanUsrRole, status: ChanUsrStatus): Promise<ChanUsr> {

        try {
            const newChanUsr = await this.prisma.chanUsr.create({
                data: {
                    user: { connect: { id: userId } },
                    channel: { connect: { id: chanId } },
                    role,
                    status
                }
            });
            return newChanUsr;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.hasConflict(`User with userId: ${userId} already exists in channel ${chanId}.`);
            } else
                error.unexpected('Unexpected error.')
        }
    }

    async createChannel(userId: number, myChanDto: FTChannel): Promise<Channel> {
        const { name, visibility } = myChanDto;

        try {
            const newChannel = await this.prisma.channel.create({
                data: {
                    name,
                    visibility,
                }
            });
            const newChanUsr = await this.createChanUsr(userId, newChannel.id, 'OWNER', 'NORMAL');

            return newChannel;

        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.hasConflict(`Channel ${name} already exists.`);
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

    // ECLIPSE STYLE
    // async deleteChannel(userId: number, chanId: number): Promise<void> {
    //     const chanUsr = await this.prisma.chanUsr.findFirst({
    //         where: {
    //             userId,
    //             chanId,
    //             role: 'OWNER',
    //         }
    //     }).catch(e => {
    //         logger.error("Unexpected error:", e);
    //         throw "An unexpected error occurred.";
    //     });
    //     if (!chanUsr) {
    //         error.notAuthorized(`Channel ID ${chanId} is not accessible for this user.`);
    //     }
    //     else {
    //         await this.prisma.channel.delete({
    //             where: { id: chanId },
    //         }).catch(e => {
    //             logger.error("Unexpected error:", e);
    //             throw "An unexpected error occurred.";
    //         });
    //     }
    // }
}
