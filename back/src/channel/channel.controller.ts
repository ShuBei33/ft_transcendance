import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Res, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User, Channel } from '@prisma/client';
import { Response } from 'express';
import { FTChannel } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { success } from 'src/success_utils';

const logger = new Logger();

@UseGuards(JwtGuard)
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService, private prisma: PrismaService) { }

	@Get('channels/:visibility')
	@ApiOperation({ summary: 'Recuperation de la liste de tous les channels publics' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async getChannel(
		@GetUser() user: User,
		@Res() res: Response,
		@Query('visibility') visibility: "PUBLIC" | "PRIVATE" | "PROTECTED"
		) {
			const channels: Channel[] = await this.channelService.retrieveChannels(visibility);
	
      		const channelNames = channels.map(channel => channel.name);
      		console.log('Channel Names:', channelNames);
			return success.general(res, "c bon"); // -> a changer pour que ca renvoie les channels et pas une reponse.
	}

	@Get('get')
	@ApiOperation({ summary: 'Recuperation de la List de vos Channels' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async get(
		@GetUser() user: User,
		@Res() res: Response
	) {
		try {
			console.log('FUNCTION Get Channel was called');
			console.log('JWT User: ', user);

			// CODE ICIz

			return res.status(200).json({
				success: true,
				message: "La recuperation de la list c'est bien passe",
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}

	@Get('get/:chanId')
	@ApiOperation({ summary: 'Recuperation de l\'historique de messages Channel' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async getMessage(
		@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response
	) {
		try {
			console.log('FUNCTION Get Message was called');
			console.log('JWT User: ', user);
			console.log('Disc Id Cible: ', chanId);

			// CODE ICI

			return res.status(200).json({
				success: true,
				message: "La recuperation des messages c'est bien passe",
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}

	@Post('create')
	@ApiOperation({ summary: 'Creation d\'un nouveau Channel' })
	@ApiResponse({ status: 200, description: 'Succes de Creation du channel' })
	@ApiResponse({ status: 400, description: 'Echec de Creation du channel' })
	async create(
		@GetUser() user: User,
		@Body() channelToCreate: FTChannel,
		@Res() res: Response
	) {
		this.channelService.createChannel(channelToCreate);
		return success.general(res, "Channel created successfully.");
	}

	@Delete('delete/:chanId')
	@ApiOperation({ summary: 'Suppression d\'un channel ou vous etez owner' })
	@ApiResponse({ status: 200, description: 'Succes de la Suppression du channel' })
	@ApiResponse({ status: 400, description: 'Echec de la Suppression du channel' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async delete(
		@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response
	) {
		try {
			console.log('FUNCTION Delete Channel was called');
			console.log('JWT User: ', user);
			console.log('Disc Id Cible: ', chanId);

			// CODE ICI

			return res.status(200).json({
				success: true,
				message: "La recuperation des messages c'est bien passe",
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}



	@Delete('leave/:chanId')
	@ApiOperation({ summary: 'Sortir de la liste user Channel' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async leave(
		@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response
	) {
		try {
			console.log('FUNCTION leave Channel was called');
			console.log('JWT User: ', user);
			console.log('Disc Id Cible: ', chanId);

			// CODE ICI

			return res.status(200).json({
				success: true,
				message: "La recuperation des messages c'est bien passe",
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}


	@Post('join/:chanId')
	@ApiOperation({ summary: 'Connection avec un channel, avec ou sans password' })
	@ApiResponse({ status: 200, description: 'Succes de la Requete' })
	@ApiResponse({ status: 400, description: 'Echec de la Requete' })
	@ApiParam({ name: 'chanId', description: 'ID du Channel', type: 'number', example: 1 })
	async join(
		@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response
	) {
		try {
			console.log('FUNCTION Join Channel was called');
			console.log('JWT User: ', user);
			console.log('Disc Id Cible: ', chanId);

			// CODE ICI

			return res.status(200).json({
				success: true,
				message: "La recuperation des messages c'est bien passe",
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
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
