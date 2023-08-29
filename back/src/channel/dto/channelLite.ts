import { Channel, ChannelMsg } from '@prisma/client';

export class ChannelLite {
	id: number;
	name: string;
	visibility:  Channel['visibility'];
	channelMsgs: ChannelMsg[];
}

export class ChannelCard {
	id: number;
	name: string;
	visibility:  Channel['visibility'];
}