import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsInt, IsNotEmpty } from "class-validator";

export class DTO_InviteChan {

	@IsInt()
	@IsNotEmpty()
	@ApiProperty({
		description: 'User Id',
		default: 2,
		examples: [ -1, 0, 1, 2, 3, 4, 1000 ],
		type: Number,
	})
	userId: User['id'];
}