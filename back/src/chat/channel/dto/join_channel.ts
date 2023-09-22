import { ApiPropertyOptional } from "@nestjs/swagger";
import { Channel } from "@prisma/client";

export class DTO_JoinChan {
	@ApiPropertyOptional({
		description: 'Mot de passe du channel',
		default: null,
		examples: [ null, 'Patate2000', '123456789' ],
		type: String,
   })
	hash?: Channel['hash'];
}