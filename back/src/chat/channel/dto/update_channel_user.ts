import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User, ChanUsr, ChanUsrRole, ChanVisibility, UserStatusMSGs } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class DTO_UpdateChanUsr {
	@IsInt()
	@ApiProperty({
		description: 'User Id',
		default: 2,
		examples: [ -1, 0, 1, 2, 3, 4, 1000 ],
		type: Number,
	})
	id: User['id'];

	@IsString()
	@IsOptional()
	@IsEnum(ChanUsrRole)
	@ApiPropertyOptional({
		description: 'User role in channel',
		default: ChanUsrRole.NORMAL,
		examples: [ ChanUsrRole.ADMIN, ChanUsrRole.NORMAL, ChanUsrRole.OWNER ],
		type: String,
	})
	role?: ChanUsrRole;

	@IsString()
	@IsOptional()
	@IsEnum(UserStatusMSGs)
	@ApiPropertyOptional({
		description: 'User status',
		default: UserStatusMSGs.NORMAL,
		examples: [ UserStatusMSGs.NORMAL, UserStatusMSGs.BLOCKED, UserStatusMSGs.MUTED, UserStatusMSGs.BANNED ],
		type: String,
	})
	status?: UserStatusMSGs;

	@IsInt()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Duration in milliseconds until it unmutes the user',
		type: Number,
	})
	statusDuration?: number;
}
