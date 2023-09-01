import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { Response } from 'express';
import { success } from 'src/utils/utils_success';

@UseGuards(JwtGuard)
@ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
@ApiTags('Game')
@ApiBearerAuth()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('getHistory/:uid')
  @ApiOperation({
    summary: "Recuperation de la liste des parti effectuee d'un utilisateur",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  @ApiParam({
    name: 'uid',
    description: "Id de l'user cible",
    type: 'number',
    example: 1,
  })
  async getHistory(
    @Param('uid', ParseIntPipe) uid_cible: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    try {
      console.log('FUNCTION GetHistory was called');
      console.log('JWT User: ', user);
      console.log('User Id Cible: ', uid_cible);

	  await this.gameService.userExists(uid_cible);
	  const history = await this.gameService.getHistory(uid_cible);

      return res.status(200).json({
        success: true,
        message: "La recuperation de la liste des partie c'est bien passe",
        data: history,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Get('joinQueue')
  @ApiOperation({
    summary: "Place l'utilisateur dans la queue",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  async joinQueue(@GetUser() user: User, @Res() res: Response) {
    await this.gameService.enQueueUser(user.id);
    return success.general(res, 'You are in queue.');
  }

  @Get('leaveQueue')
  @ApiOperation({
    summary: "Place l'utilisateur dans la queue",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  async leaveQueue(@GetUser() user: User, @Res() res: Response) {
    await this.gameService.deQueueUser(user.id);
    return success.general(res, 'You are no longer in queue.');
  }
}
