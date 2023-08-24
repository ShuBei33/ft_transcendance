import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DTO_AnswerInvitation, DTO_AnswerInvitationSchema } from './dto';

// FRIENDS {
//     - addFriend // SEULEMENT EN SERVICE
// }

const user1 = {
	id: 3,
};


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
			console.log('FUNCTION Get Friend was called and retrieved friends list for user of id ' + user.id);
			console.log('JWT User: ', user); 

			// CODE ICI
			const data = await this.friendService.getFriendsList(user.id);
			
			return res.status(200).json({
				success: true,
				message: "La recuperation de la liste d'amis c'est bien passe",
				data: data,
			});
		} catch (err: any) {
			return res.status(400).json({
				success: false,
				message: err.message,
			});
		}
	}

	@Delete('remove/:uid')
    @ApiOperation({ summary: 'Suppresion d\'un utilisateur de votre liste d\'amis' })
    @ApiResponse({ status: 200, description: 'Succes de la suppresion ' })
    @ApiResponse({ status: 400, description: 'Echec de la suppresion' })
	@ApiParam({ name: 'uid', description: 'ID de l\'user cible', type: 'number', example: 1 })
	async remove(
		@Param('uid', ParseIntPipe) uid: number, 
		@GetUser() user: User, 
		@Res() res: Response,
	) { try {
			console.log('FUNCTION Remove Friend was called');
			console.log('JWT User: ', user); 
			console.log('User Id Cible: ', uid);

			await this.friendService.deleteFriend(user.id, uid); //! Maybe change uid to a string ? idk...
			await this.friendService.deleteFriend(uid, user.id); //! Cause the user is not going to give an id right ? Or maybe we show id in the front ?

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
			const data = await this.friendService.getReceivedPendingInvites(user.id);

            return res.status(200).json({success: true, data: data });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}	
	}

	@Post('sendInvitation')
    @ApiOperation({ summary: 'Envoie D\'une invitation Ami' })
    @ApiResponse({ status: 200, description: 'Succes de l\'envoie de l\'invitation' })
    @ApiResponse({ status: 400, description: 'Echec de l\'envoie de l\'invitation' })
	async sendInvitation(
		@Body('usernameToAdd') usernameToAdd: string,
		@GetUser() user: User,
		@Res() res: Response
	) { try {
			console.log('FUNCTION SendInvitation Friend was called');
			console.log('JWT User: ', user);

			const response = await this.friendService.sendFriendInvitation(user, 'Fantomas'); // Hamtaro id 3

            return res.status(200).json({success: true, response: response });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}
	}

	@Post('resolveInvitation')
    @ApiOperation({ summary: 'Envoi de la Resolution d\'une requete d\'ami' })
    @ApiResponse({ status: 200, description: 'Succes de la Requete' })
    @ApiResponse({ status: 400, description: 'Echec de la Requete' })
	async resolveInvitation(
		@Body() answer: boolean,
		@Body() fromUser: string,
		@GetUser() user: User,
		@Res() res: Response
	) { try {
			console.log('FUNCTION ResolveInvitation Friend was called');
			console.log('JWT User: ', user);
			console.log('Answer Invitation: ', answer);

			const response = await this.friendService.acceptFriendInvitation(user.id, true, 'Hamtaro');

            return res.status(200).json({success: true });
		} catch (err: any) {
            return res.status(400).json({success: false, message: err.message});
		}
	}
}
