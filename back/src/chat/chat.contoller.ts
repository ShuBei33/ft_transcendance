import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DTO_UpdateChanUsr } from './channel/dto';
import { UserLite } from 'src/user/dto';
import { GetUser } from 'src/auth/decorator';
import { ChatGateway } from './chat.gateway';
import { ChanAdminService } from './channel/admin/chan_admin.service';
import { Response } from 'express';

@UseGuards(JwtGuard) 
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(
        private chatGateway: ChatGateway,
        private chanAdmin: ChanAdminService,
	) {}

    private logger: Logger = new Logger('ChatService');

	@Patch('channel/admin/:chanId/user')
	@ApiOperation({ summary: 'Update a User of the Channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async updateChannelUser(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() usrToModify: DTO_UpdateChanUsr,
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		try {
			await this.chanAdmin.isAdminChannel( user.id, chanId );
			await this.chanAdmin.updateChanUsr( chanId, usrToModify)
            return res.status(200).json({success: true });
		} catch (err) {
            return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}
	}

	@Patch('channel/admin/:chanId/settings')
	@ApiOperation({ summary: 'Update channel settings' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async updateChannelSetting(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() usrToModify: DTO_UpdateChanUsr,
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		try {
			await this.chanAdmin.isAdminChannel( user.id, chanId );
			// await this.chanAdmin.updateChanUsr( chanId, usrToModify)
            return res.status(200).json({success: true });
		} catch (err) {
			console.log(err);
            return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}
	}
	

}
