import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FTChannel } from './dto';
import { Channel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Logger } from '@nestjs/common';
import { error } from 'src/error_utils';

// const logger = new Logger();

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createChannel(myChanDto: FTChannel): Promise<Channel> {
        const { name, visibility } = myChanDto;
        // logger.log("your dto here !", myChanDto)
        try {
            // logger.log("In the TRY BLOCK")
            const newChannel = await this.prisma.channel.create({
                data: {
                    name,
                    visibility,
                },
            });
            return newChannel;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                error.hasConflict(`Channel ${name} already exist.`);
            } else
                throw "Unexpected error."
        }
    }

	async retrieveChannels(visibility: "PUBLIC" | "PRIVATE" | "PROTECTED"): Promise<Channel[]> {        try {
            const newChannel = await this.prisma.channel.findMany({
                where: {
                    visibility,
                },
            });
            return newChannel;
        } catch (e) {
                throw "Unexpected error."
        }
    }
}
