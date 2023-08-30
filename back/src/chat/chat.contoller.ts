import { Body, Controller, Delete, Logger, Param, ParseIntPipe, Patch, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChanAdminService } from './channel/admin/chan_admin.service';
import { DTO_UpdateChan, DTO_UpdateChanUsr } from './channel/dto';
import { GetUser } from 'src/auth/decorator';
import { UserLite } from 'src/user/dto';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { ChannelService } from './channel/channel.service';
import { ChatGateway } from './chat.gateway';

@UseGuards(JwtGuard) 
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(
		private chatGate: ChatGateway,
        private chanAdmin: ChanAdminService,
		private chanService: ChannelService
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
			await this.chanAdmin.updateUserChannel( chanId, usrToModify)
            return res.status(200).json({success: true, message: 'User Channel Edited.' });
		} catch (err) {
			this.logger.error(err);
            return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}
	}

	@Patch('channel/admin/:chanId/settings')
	@ApiOperation({ summary: 'Update Channel settings' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async updateChannelSetting(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() channelModified: DTO_UpdateChan,
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		try {
			await this.chanAdmin.isAdminChannel( user.id, chanId );
			await this.chanAdmin.updateChannelSettings( chanId, channelModified)
			return res.status(200).json({success: true, message: 'Settings Channel Edited.' });
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}
	}
	
	@Delete('channel/kick/:chanId/:usrToKickId')
	@ApiOperation({ summary: 'Kick a user from a channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	@ApiParam({ name: 'usrToKickId', description: 'User ID', type: 'number', example: 1 })
	async kick(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Param('usrToKickId', ParseIntPipe) usrToKickId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			const role = await this.chanAdmin.isAdminChannel( user.id, chanId );
			await this.chanAdmin.kickUserChannel( role, chanId, usrToKickId )
			return res.status(200).json({success: true, message: 'User kicked successfully.' });
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}
	}

	@Delete('channel/leave/:chanId')
	@ApiOperation({ summary: 'Leave a channel, Destoye it if u are the owner' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async leave(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			const role = await this.chanAdmin.getRoleUser( user.id, chanId );
			if ( role == 'OWNER' ) {
				this.chatGate.channelRemoved( chanId );
				this.chanService.removeChannel( chanId );
				return res.status(200).json({success: true, message: 'Channel Destroye' });
			} else {
				this.chatGate.channelDelUser( chanId, user );
				this.chanService.leaveChannel(user.id, chanId);
				return res.status(200).json({success: true, message: 'Leaving Channel' });
			}
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "Vous n'avais pas les privilege suffisant"});
		}

	}

	
}
