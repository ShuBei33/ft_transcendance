import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FTChannel } from './dto';
import { Channel } from '@prisma/client';

@Injectable()
export class ChannelService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async   createChannel(myChanDto: FTChannel): Promise<Channel> {
        const { name, visibility } = myChanDto;
    
        const newChannel = await this.prisma.channel.create({
            data: {
                name,
                visibility,
            },
        });
        console.log(newChannel);
        return newChannel;
    }
}
