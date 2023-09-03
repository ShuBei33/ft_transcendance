import { Body, Controller, Delete, Logger, Param, ParseIntPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChanAdminService } from './channel/admin/chan_admin.service';
import { ChannelLite, DTO_InviteChan, DTO_JoinChan, DTO_UpdateChan, DTO_UpdateChanUsr } from './channel/dto';
import { GetUser } from 'src/auth/decorator';
import { UserLite } from 'src/user/dto';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { ChannelService } from './channel/channel.service';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';
import { ChanVisibility } from '@prisma/client';

//prettier-ignore
@UseGuards(JwtGuard) 
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
@ApiTags('Socket')
@Controller('chat')
export class ChatController {
	constructor(
		private chatGate: ChatGateway,
        private chanAdmin: ChanAdminService,
		private chanService: ChannelService,
		private userService: UserService
	) {}

    private logger: Logger = new Logger('ChatService');

	@Patch('channel/admin/:chanId/user')
	@ApiOperation({ summary: 'Update a User of the Channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	@ApiBody({ description: "DTO pour Update les droit Channel d'un User", type: DTO_UpdateChanUsr, })
	async updateChannelUser(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() userToModify: DTO_UpdateChanUsr,
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		try {
			const { role } = await this.chanAdmin.userHasRoleOrThrow(['ADMIN', 'OWNER'], user.id, chanId);
			await this.chanAdmin.userHasStatusOrThrow(['NORMAL'], user.id, chanId);
			const chanUsrUpdated = await this.chanAdmin.updateUserChannel(role, chanId, userToModify);
			this.chatGate.channelUserRoleEdited(chanId, chanUsrUpdated);
            return res.status(200).json({success: true, message: 'User Channel Edited.' });
		} catch (err) {
			this.logger.error(err.status);
            return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}

	@Patch('channel/admin/:chanId/settings')
	@ApiOperation({ summary: 'Update Channel settings' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	@ApiBody({ description: "DTO pour Update les settings d'un channels", type: DTO_UpdateChan, })
	async updateChannelSetting(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() channelModified: DTO_UpdateChan,
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		try {
			await this.chanAdmin.userHasRoleOrThrow(['ADMIN', 'OWNER'], user.id, chanId);
			await this.chanAdmin.userHasStatusOrThrow(['NORMAL'], user.id, chanId);
			const channel: ChannelLite = await this.chanAdmin.updateChannelSettings( chanId, channelModified);
			this.chatGate.wss.to(`chan_${chanId}`).emit("updated", channel);
			return res.status(200).json({success: true, message: 'Channel updated.', data: channel });
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "Operation forbidden."});
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
			const { role } = await this.chanAdmin.userHasRoleOrThrow(['ADMIN', 'OWNER'], user.id, chanId);
			await this.chanAdmin.userHasStatusOrThrow(['NORMAL'], user.id, chanId);
			await this.chanAdmin.kickUserChannel( role, chanId, usrToKickId )
			return res.status(200).json({success: true, message: 'User kicked successfully.' });
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}

	@Delete('channel/leave/:chanId')
	@ApiOperation({ summary: 'Leave a channel, delete it if you are the owner' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async leaveChannel(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			const role = await this.chanAdmin.getRoleUser( user.id, chanId );
			if ( role == 'OWNER' ) {
				this.chatGate.channelRemoved( chanId );
				this.chanService.removeChannel( chanId );
				return res.status(200).json({success: true, message: 'Channel deleted' });
			} else {
				await this.chanAdmin.userHasStatusOrThrow(['NORMAL', 'MUTED'], user.id, chanId);
				this.chatGate.channelDelUser( chanId, user );
				this.chanService.leaveChannel(user.id, chanId);
				return res.status(200).json({success: true, message: 'Leaving Channel' });
			}
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}

	@Delete('channel/delete/:chanId')
	@ApiOperation({ summary: 'Delete a channel that you own' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel Id', type: 'number', example: 1 })
	async deleteChannel(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			const role = await this.chanAdmin.getRoleUser( user.id, chanId );
			if ( role == 'OWNER' ) {
				this.chatGate.channelRemoved( chanId );
				this.chanService.removeChannel( chanId );
				return res.status(200).json({success: true, message: 'Channel has been successfully deleted.' });
			}
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}

	@Post('channel/join/:chanId')
	@ApiOperation({ summary: 'Join any kind of channels' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiBody({ description: "Mot de passe si channel Protected", type: DTO_JoinChan, })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async joinChannel(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() channelToJoin: DTO_JoinChan,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			await this.chanService.joinChannel(user.id, chanId, channelToJoin);
			this.chatGate.channelNewUser(chanId, user)
			return res.status(200).json({success: true, message: 'You have successfully joined a channel.' });
		} catch (err) {
			this.logger.error(err);
			return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}

	@Post('channel/invite/:chanId')
	@ApiOperation({ summary: 'Send an invitation to a user to join a channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	@ApiBody({ description: "ID of the user to invite", type: DTO_InviteChan, })
	async inviteToChannel(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() userToInvite: DTO_InviteChan,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		try {
			await this.chanAdmin.userHasRoleOrThrow(['ADMIN', 'OWNER'], user.id, chanId);
			await this.chanAdmin.userHasStatusOrThrow(['NORMAL'], user.id, chanId);
			const targetUser = await this.userService.get_user(userToInvite.userId);
			await this.chanService.inviteToChannel(user.id, chanId, userToInvite);
			this.chatGate.channelNewUser(chanId, targetUser)
			return res.status(200).json({success: true, message: 'You have successfully invited someone to a channel.' });
		} catch (err) {
			console.log(err);
			return res.status(400).json({success: false, message: "You do not have the correct access rights."});
		}
	}
}
//prettier-ignore-end
