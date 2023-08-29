import { IsNotEmpty, IsEnum, IsInt, Length } from 'class-validator';
import { User, Channel, ChanUsr } from '@prisma/client';
import {
  ChanVisibility,
  ChanUsrRole,
  UserStatusMSGs,
  ChannelMsg,
} from '@prisma/client';

export class DTO_CreateChan {
	@IsNotEmpty()
	@Length(1, 50)
	name: Channel['name'];
	
	@IsEnum(ChanVisibility)
	visibility: Channel['visibility'];

	DTOhash?: Channel['hash'];
}

export class DTO_JoinChan {
	hash?: Channel['hash'];
}

export class DTO_InviteChan {
	@IsInt()
	userId: User['id'];
}

export class DTO_UpdateChan {
	name?: Channel['name'];
	visibility?: Channel['visibility'];
	hash?: Channel['hash'];
}

export class DTO_UpdateChanUsr {
	@IsInt()
	id: ChanUsr['id'];
	
	role?: ChanUsrRole;
	status?: UserStatusMSGs;
	statusDuration?: Date;
}

export class DTO_CreateMessage {
	content: string;
    userId: number;
    channelId: number;
}