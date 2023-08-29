import { IsNotEmpty, IsEnum, IsInt, Length, IsDate, IsString } from 'class-validator';
import { User, Discussion, DiscussionMsg } from '@prisma/client';
import { UserStatusMSGs } from '@prisma/client';

export class DTO_ChangeStatusDiscussion {
    @IsInt()
	restrainedId: User['id'];

    @IsInt()
	discId: Discussion['id'];

    // You won't be able to change your own status
    userStatus?: UserStatusMSGs;
}

export class DTO_DirectMessage {
	// receverId
    @IsInt()
	secondUsrId: User['id'];

    @IsNotEmpty()
    @IsString()
	content: DiscussionMsg['content'];
}


export class DiscussionLite {
	id: number;
    userId1: number;
    userId2: number;
	discussionsMsgs: DiscussionMsg[];
}