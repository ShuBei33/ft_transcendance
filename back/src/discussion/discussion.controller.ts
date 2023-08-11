import { Body, Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtGuard)
@ApiTags('Discussion')
@ApiBearerAuth()
@Controller('discussion')
export class DiscussionController {
	constructor(private DiscussionService: DiscussionService) {}

	@Get('get/:discId')
	@ApiOperation({ summary: 'Recuperation de l\'historique de messages Discussion' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async get(
		@Param('id', ParseIntPipe) discId: number, // A CONTROLLER POUR SAVOIR SI CEST BIEN LA TIENNE
		@GetUser() user: User,
		@Res() res: Response 
	) { try {
			console.log('FUNCTION Get Friend was called');
			console.log('JWT User: ', user);
			console.log('Disc Id Cible: ', discId);

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

