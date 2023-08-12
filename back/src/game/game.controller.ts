import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtGuard)
@ApiTags('Game')
@ApiBearerAuth()
@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}

	@Get('getHistory/:id')
    @ApiOperation({ summary: 'Recuperation de la liste des parti effectuee d\'un utilisateur' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async get(
		@Param('id', ParseIntPipe) uid_cible: number, 
		@GetUser() user: User,
		@Res() res: Response 
	) { try {
			console.log('FUNCTION GetHistory was called');
			console.log('JWT User: ', user);
			console.log('User Id Cible: ', uid_cible);

			// CODE ICI

			return res.status(200).json({
				success: true,
				message: "La recuperation de la liste des partie c'est bien passe",
				data: null
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}
}
