import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { ChanVisibility, Channel, User } from '@prisma/client';

export class DTOCreateChan {
	@IsNotEmpty()
	@Length(1, 50)
	name: Channel['name'];
	
	@IsEnum(ChanVisibility)
	visibility: Channel['visibility'];
}

export class DTOJoinChan {
	hash?: Channel['hash'];
}

export class DTOInviteChan {
	userId: User['id'];
}
