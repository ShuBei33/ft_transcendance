import { Body, Controller, Delete, Get, Param, Query, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { DTOCreateChan, DTOJoinChan, DTOInviteChan } from './dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { success } from 'src/success_utils';

const logger = new Logger();

@UseGuards(JwtGuard)
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService, private prisma: PrismaService) { }

	// @Get('get')
	// @ApiOperation({ summary: 'Recuperation de la List de vos Channels' })
	// @ApiResponse({ status: 200, description: 'Succes de la Requete' })
	// @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	// async get(
	// 	@GetUser() user: User,
	// 	@Res() res: Response
	// ) {
	// 	try {
	// 		console.log('FUNCTION Get Channel was called');
	// 		console.log('JWT User: ', user);

	// 		// CODE ICI

	// 		return res.status(200).json({
	// 			success: true,
	// 			message: "La recuperation de la list c'est bien passe",
	// 		});
	// 	} catch (err: any) {
	// 		return res.status(400).json({
	// 			success: false,
	// 			message: err.message,
	// 		});
	// 	}
	// }

	// @Get('get/:chanId')
	// @ApiOperation({ summary: 'Recuperation de l\'historique de messages Channel' })
	// @ApiResponse({ status: 200, description: 'Succes de la Requete' })
	// @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	// @ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	// async getMessage(
	// 	@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
	// 	@GetUser() user: User,
	// 	@Res() res: Response
	// ) {
	// 	try {
	// 		console.log('FUNCTION Get Message was called');
	// 		console.log('JWT User: ', user);
	// 		console.log('Disc Id Cible: ', chanId);

	// 		// CODE ICI

	// 		return res.status(200).json({
	// 			success: true,
	// 			message: "La recuperation des messages c'est bien passe",
	// 		});
	// 	} catch (err: any) {
	// 		return res.status(400).json({
	// 			success: false,
	// 			message: err.message,@Get('get')
	// @ApiOperation({ summary: 'Recuperation de la List de vos Channels' })
	// @ApiResponse({ status: 200, description: 'Succes de la Requete' })
	// @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	// async get(
	// 	@GetUser() user: User,
	// 	@Res() res: Response
	// ) {
	// 	try {
	// 		console.log('FUNCTION Get Channel was called');
	// 		console.log('JWT User: ', user);

	// 		// CODE ICI

	// 		return res.status(200).json({
	// 			success: true,
	// 			message: "La recuperation de la list c'est bien passe",
	// 		});
	// 	} catch (err: any) {
	// 		return res.status(400).json({
	// 			success: false,
	// 			message: err.message,
	// 		});
	// 	}
	// }

	// @Get('get/:chanId')
	// @ApiOperation({ summary: 'Recuperation de l\'historique de messages Channel' })
	// @ApiResponse({ status: 200, description: 'Succes de la Requete' })
	// @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	// @ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	// async getMessage(
	// 	@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
	// 	@GetUser() user: User,
	// 	@Res() res: Response
	// ) {
	// 	try {
	// 		console.log('FUNCTION Get Message was called');
	// 		console.log('JWT User: ', user);
	// 		console.log('Disc Id Cible: ', chanId);

	// 		// CODE ICI

	// 		return res.status(200).json({
	// 			success: true,
	// 			message: "La recuperation des messages c'est bien passe",
	// 		});
	// 	} catch (err: any) {
	// 		return res.status(400).json({
	// 			success: false,
	// 			message: err.message,
	// 		});
	// 	}
	// }
	// 		});
	// 	}
	// }

	@Post('create')
	@ApiOperation({ summary: 'Create a new channel' })
	@ApiResponse({ status: 200, description: 'Channel successfully created.' })
	@ApiResponse({ status: 400, description: 'Bad request' })
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
	@ApiResponse({ status: 200, description: 'Channel successfully deleted.' })
	@ApiResponse({ status: 400, description: 'Could not delete channel' })
	@ApiParam({ name: 'chanId', description: 'Channel Id', type: 'number', example: 1 })
	async delete(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelDeleted = await this.channelService.deleteChannel(user.id, chanId);
		return success.general(res, "Channel deleted successfully.", channelDeleted);
	}

	@Delete('leave/:chanId')
	@ApiOperation({ summary: 'Leave a channel' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async leave(
		@Param('chanId', ParseIntPipe) chanId: number,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelLeft = await this.channelService.leaveChannel(user.id, chanId);
		return success.general(res, "Channel left successfully.", channelLeft);
	}

	@Post('join/:chanId')
	@ApiOperation({ summary: 'Connection avec un channel, avec ou sans password' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
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
	@ApiOperation({ summary: 'Connection avec un channel, avec ou sans password' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async inviteToChannel(
		@Param('chanId', ParseIntPipe) chanId: number,
		@Body() userToInvite: DTOInviteChan,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const channelJoined = await this.channelService.inviteToChannel(user.id, chanId, userToInvite);
		return success.general(res, "Channel joined successfully.", channelJoined);
	}
}


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
