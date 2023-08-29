import { Channel } from '@prisma/client';

export class ChannelLite {
	id: Channel['id'];
	name: Channel['name'];
	visibility:  Channel['visibility'];
}