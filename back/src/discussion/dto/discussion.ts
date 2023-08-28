import { IsNotEmpty, IsEnum, IsInt, Length, IsDate, IsString } from 'class-validator';
import { User, Discussion, DiscussionMsg } from '@prisma/client';
import { UserStatusMSGs } from '@prisma/client';

export class DTORestrainUsr {
    @IsInt()
	restrainedId: User['id'];

    @IsInt()
	discId: Discussion['id'];

    // You won't be able to change your own status
    userStatus?: UserStatusMSGs;
}

export class DTOdm {
    @IsInt()
	secondUsrId: User['id'];

    @IsNotEmpty()
    @IsString()
	content: DiscussionMsg['content'];
}
