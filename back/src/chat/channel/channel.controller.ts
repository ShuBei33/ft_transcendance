import { UseGuards, Controller, Get, Post, Delete, Patch, Inject, forwardRef } from '@nestjs/common';
import { Param, Body, ParseIntPipe, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { DTO_CreateChan, DTO_JoinChan, DTO_InviteChan, DTO_UpdateChan, DTO_UpdateChanUsr } from './dto';
import { success } from 'src/utils/utils_success';
import { UserLite } from 'src/user/dto';
import { ChanAdminService } from './admin/chan_admin.service';

// const logger = new Logger();

@UseGuards(JwtGuard)
@ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
	) {}

	@Get('all')
	@ApiOperation({ summary: 'Retrieve all non-private channels' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	async getAll(
		@Res() res: Response,
	) {
		const channelList = await this.channelService.getAllChannels();
		return success.general(res, "Subscribed channel list retrieved successfully.", channelList);
	}

	@Get('mine')
	@ApiOperation({ summary: 'Retrieve a list of subscribed channels' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	async getMine(
		@GetUser() user: UserLite,
		@Res() res: Response,
	) {
		const channelList = await this.channelService.getMyChannels(user.id);
		return success.general(res, "Subscribed channel list retrieved successfully.", channelList);
	}

	@Get('msgs/:chanId')
	@ApiOperation({ summary: 'Retrieve a channel\'s messages' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async getMessage(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		const channelMsgs = await this.channelService.getChannelMsgs(user.id, chanId);
		return success.general(res, "Channel messages retrieved successfully.", channelMsgs);
	}
	
	@Post('create')
	@ApiOperation({ summary: 'Create a new channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	async create(
		@GetUser() user: UserLite,
		@Body() channelToCreate: DTO_CreateChan,
		@Res() res: Response
	) {
		await this.channelService.createChannel(user.id, channelToCreate);
		return success.general(res, "Channel created successfully.");
	}

	@Delete('delete/:chanId')
	@ApiOperation({ summary: 'Delete a channel that you own' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel Id', type: 'number', example: 1 })
	async delete(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		const channelDeleted = await this.channelService.deleteChannel(user.id, chanId);
		return success.general(res, "Channel deleted successfully.", channelDeleted);
	}

	@Post('join/:chanId')
	@ApiOperation({ summary: 'Join any kind of channels' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async join(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() channelToJoin: DTO_JoinChan,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		const channelJoined = await this.channelService.joinChannel(user.id, chanId, channelToJoin);
		return success.general(res, "Channel joined successfully.", channelJoined);
	}

	@Post('invite/:chanId')
	@ApiOperation({ summary: 'Send an invitation to a user to join a channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async inviteTo(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() userToInvite: DTO_InviteChan,
		@GetUser() user: UserLite,
		@Res() res: Response
	) {
		const channelJoined = await this.channelService.inviteToChannel(user.id, chanId, userToInvite);
		return success.general(res, "User invited successfully.", channelJoined);
	}




}
