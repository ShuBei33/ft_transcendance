// import { User, Channel } from '@prisma/client';

// export class ChannelLite {
// 	id: Channel['id'];
// 	name: Channel['name'];
// 	visibility: Channel['visibility'];
// }

export class ChannelLite {
	id: number;
	name: string;
	visibility: number;
}