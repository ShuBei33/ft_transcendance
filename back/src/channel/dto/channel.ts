import { IsNotEmpty, IsEnum, IsInt, Length, IsDate } from 'class-validator';
import { User, Channel, ChanUsr } from '@prisma/client';
import { ChanVisibility, ChanUsrRole, ChanUsrStatus } from '@prisma/client';

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
	@IsInt()
	userId: User['id'];
}

export class DTOUpdateChan {	
	name?: Channel['name'];
	visibility?: Channel['visibility'];
	hash?: Channel['hash'];
}

export class DTOUpdateChanUsr {
	@IsInt()
	id: ChanUsr['id'];
	
	role?: ChanUsrRole;
	status?: ChanUsrStatus;
	statusDuration?: Date;
}

