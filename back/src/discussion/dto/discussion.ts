import { IsNotEmpty, IsEnum, IsInt, Length, IsDate } from 'class-validator';
import { User, Discussion } from '@prisma/client';
import { UserStatusMSGs } from '@prisma/client';

export class DTORestrainUsr {
    @IsInt()
	restrainedId: User['id'];

    @IsInt()
	discId: Discussion['id'];

    // You won't be able to change your own status
    user1Status?: UserStatusMSGs;
    user2Status?: UserStatusMSGs;
}
