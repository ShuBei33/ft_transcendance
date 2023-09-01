import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChanVisibility, Channel } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, Length } from "class-validator";

export class DTO_CreateChan {
	@IsNotEmpty()
	@Length(1, 50)
	@ApiProperty({
		 description: 'Channel name',
		 default: 'MySuperChannel',
		 examples: [ 'MySuperChannel', 'MonChannel', 'LesCopains' ],
		 type: String, minLength: 5, maxLength: 50,
	})
	name: Channel['name'];
	
	@IsEnum(ChanVisibility)
	@ApiProperty({
		description: 'Channel visibility',
		default: ChanVisibility.PUBLIC,
		examples: [ ChanVisibility.PRIVATE, ChanVisibility.PROTECTED, ChanVisibility.PUBLIC ],
		type: String,
   })
	visibility: Channel['visibility'];

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Channel password',
		default: null,
		examples: [ null, 'Patate2000', '123456789' ],
		type: String,
	})
	password?: Channel['hash'];
}
