import { Body, Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DTO_AnswerInvitation } from './dto';

// FRIENDS {
//     - addFriend // SEULEMENT EN SERVICE
// }

@UseGuards(JwtGuard)
@ApiTags('Friend')
@ApiBearerAuth()
@Controller('friend')
export class FriendController {
	constructor(private friendService: FriendService) {}

	@Get('get')
    @ApiOperation({ summary: 'Recuperation de la liste d\'amis de l\'utilisateur en court' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async get(
		@GetUser() user: User,
		@Res() res: Response 
	) { try {
			console.log('FUNCTION Get Friend was called');
			console.log('JWT User: ', user);

			// CODE ICI
			// const data = service. 
			
			return res.status(200).json({
				success: true,
				message: "La recuperation de la liste d'amis c'est bien passe",
				// data: data,
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}

	@Get('remove/:uid')
    @ApiOperation({ summary: 'Suppresion d\'un utilisateur de votre liste d\'amis' })
    @ApiResponse({ status: 200, description: 'Succes de la suppresion ' })
    @ApiResponse({ status: 400, description: 'Echec de la suppresion' })
	async remove(
		@Param('uid', ParseIntPipe) uid: number, 
		@GetUser() user: User,
		@Res() res: Response,
	) { try {
			console.log('FUNCTION Remove Friend was called');
			console.log('JWT User: ', user);
			console.log('User Id Cible: ', uid);

			// CODE ICI

            return res.status(200).json({success: true });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});

		}
	}

	@Get('getInvitation')
    @ApiOperation({ summary: 'Recuperation de la liste des invitation Pending' })
    @ApiResponse({ status: 200, description: 'Succes de la Recuperation' })
    @ApiResponse({ status: 400, description: 'Echec de la Recuperation' })
	async getInvitation(
		@GetUser() user: User,
		@Res() res: Response
	) { try {
			console.log('FUNCTION GetInvitation Friend was called');
			console.log('JWT User: ', user);

			// CODE ICI

            return res.status(200).json({success: true });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}	
	}

	@Get('sendInvitation')
    @ApiOperation({ summary: 'Envoie D\'une invitation Ami' })
    @ApiResponse({ status: 200, description: 'Succes de l\'envoie de l\'invitation' })
    @ApiResponse({ status: 400, description: 'Echec de l\'envoie de l\'invitation' })
	async sendInvitation(
		@GetUser() user: User,
		@Res() res: Response
	) { try {
			console.log('FUNCTION SendInvitation Friend was called');
			console.log('JWT User: ', user);

			// CODE ICI

            return res.status(200).json({success: true });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}
	}

	@Get('resolveInvitation')
    @ApiOperation({ summary: 'Envoi de la Resolution d\'une requete d\'ami' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async resolveInvitation(
		@Body() answer: DTO_AnswerInvitation,
		@GetUser() user: User,
		@Res() res: Response
	) { try {
			console.log('FUNCTION ResolveInvitation Friend was called');
			console.log('DTO Answer Invitation: ', answer);
			console.log('JWT User: ', user);

			// CODE ICI

            return res.status(200).json({success: true });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}
	}
}
