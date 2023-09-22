import { ApiProperty } from '@nestjs/swagger';

export class FTAuth {
	access_token: string;
	refresh_token: string;
	username: string;
}