import { Body, Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtGuard)
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService) {}

	@Get('get/:chanId')
	@ApiOperation({ summary: 'Recuperation de l\'historique de messages Channel' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async get(
		@Param('chanId', ParseIntPipe) chanId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response 
	) { try {
			console.log('FUNCTION Get Friend was called');
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


	@Get('create')
	async create() {}

	@Get('delete/:chanId')
	async delete() {}

	@Get('leave/:chanId')
	async leave() {}

	@Get('join/:chanId')
	async join() {}

	@Get('join/:chanId')
	async createChannel() {}

}


// CHAT {
//     - createChan
//     - chanSettings
//         - renameChan
//         - changeChanPwd
//         - changeVisibility
//     - deleteChan
//         - disconnectAllUsrs
//     - showSubscribedChans
//     - leaveChan
//     - showMsgs
//         - showDMs
//         - showChanMsgs
//     - addUsr
//     - changeUsrStatus
//         - muteUsr
//         - banUsr
//         - setPriv
// }
