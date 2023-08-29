import { Channel } from '@prisma/client';

export class ChannelLite {
	id: number;
	name: string;
	visibility:  Channel['visibility'];
}