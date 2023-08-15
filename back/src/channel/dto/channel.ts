import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { ChanVisibility } from '@prisma/client';

export class FTChannel {
	@IsNotEmpty()
	@Length(1, 50)
	name: string;
	
	@IsEnum(ChanVisibility)
	visibility: ChanVisibility;
}
