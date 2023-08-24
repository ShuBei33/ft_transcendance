import { UseGuards, Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { Param, Body, Query, ParseIntPipe, Res } from '@nestjs/common';
import { Logger } from '@nestjs/common'; // for testing purposes
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { DTOCreateChan, DTOJoinChan, DTOInviteChan, DTOUpdateChan, DTOChanUsr } from './dto';
import { ChanVisibility, ChanUsrRole } from '@prisma/client';
import { success } from 'src/utils/utils_success';
import { channel } from 'diagnostics_channel';

const logger = new Logger();

@UseGuards(JwtGuard)
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService, private prisma: PrismaService) { }

	@Get('all')
	@ApiOperation({ summary: 'Retrieve all non-private channels' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	async getAll(
		// @GetUser() user: User,
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
		@GetUser() user: User,
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
		@GetUser() user: User,
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
		@GetUser() user: User,
		@Body() channelToCreate: DTOCreateChan,
		@Res() res: Response
	) {
		const newChannel = await this.channelService.createChannel(user.id, channelToCreate);
		return success.general(res, "Channel created successfully.", newChannel);
	}

	@Delete('delete/:chanId')
	@ApiOperation({ summary: 'Delete a channel that you own' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel Id', type: 'number', example: 1 })
	async delete(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: User,
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
		@Body() channelToJoin: DTOJoinChan,
		@GetUser() user: User,
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
		@Body() userToInvite: DTOInviteChan,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelJoined = await this.channelService.inviteToChannel(user.id, chanId, userToInvite);
		return success.general(res, "User invited successfully.", channelJoined);
	}

	@Delete('leave/:chanId')
	@ApiOperation({ summary: 'Leave a channel' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async leave(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelLeft = await this.channelService.leaveChannel(user.id, chanId);
		return success.general(res, "Channel left successfully.", channelLeft);
	}

	@Patch('adminOptions/:chanId')
	@ApiOperation({ summary: 'Update channel settings' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async update(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() channelToUpdate: DTOUpdateChan,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelModified = await this.channelService.updateChannel(user.id, chanId, channelToUpdate);
		return success.general(res, "Channel settings updated successfully.", channelModified);
	}

	@Patch('adminOptions/:chanId/usrpriv')
	@ApiOperation({ summary: 'Update channel settings' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1 })
	async setPrivileges(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() usrToModify: DTOChanUsr,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelModified = await this.channelService.updateChanUsr(user.id, chanId, usrToModify);
		return success.general(res, "Channel settings updated successfully.", channelModified);
	}
}

// updateCHannel(dto: nom, vibiliste mdp)
// setUserPrivilege()
//
// CHAT {
//     - createChan 				OK
//     - chanSettings				
//         - renameChan				-> SERVICE
//         - changeChanPwd			-> SERVICE
//         - changeVisibility		-> SERVICE
//     - deleteChan					OK
//         - disconnectAllUsrs		-> SERVICE
//     - showSubscribedChans		OK
//     - leaveChan					OK
//     - showMsgs					OK
//         - showDMs				
//         - showChanMsgs
//     - addUsr
//     - changeUsrStatus
//         - muteUsr
//         - banUsr
//         - setPriv
// }
