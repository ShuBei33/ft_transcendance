import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from 'src/auth/guard';
import { Friendship, StatusInv } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserLite } from 'src/user/dto';
import { success } from 'src/utils/utils_success';
import { error } from 'src/utils/utils_error';
import { Logger } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';

const logger = new Logger();

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(
    private friendService: FriendService,
    private lobbyGate: LobbyGateway,
  ) {}

  @Get('get/:status/:filterUser')
  @ApiOperation({
    summary: "Recuperation de la liste d'amis de l'utilisateur en court",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  async get(
    @GetUser() user: UserLite,
    @Res() res: Response,
    @Param('status') status: StatusInv,
    @Param('filterUser', ParseBoolPipe) filterUser: boolean,
  ) {
    try {
      const data = await this.friendService.getFriendsList(
        user.id,
        status,
        filterUser,
      );
      return success.general(res, 'Friends retrieved successfully', data);
    } catch (err: any) {
      error.unexpected(err);
    }
  }

  @Delete('remove/:uid')
  @ApiOperation({
    summary: "Suppresion d'un utilisateur de votre liste d'amis",
  })
  @ApiResponse({ status: 200, description: 'Succes de la suppresion ' })
  @ApiResponse({ status: 400, description: 'Echec de la suppresion' })
  @ApiParam({
    name: 'uid',
    description: "ID de l'user cible",
    type: 'number',
    example: 1,
  })
  async remove(
    @Param('uid', ParseIntPipe) uid: number,
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
      const deletedFriendship = await this.friendService.deleteFriend(user.id, uid);

      return success.general(res, "Friendship deleted", deletedFriendship);
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  @Get('getInvitation')
  @ApiOperation({ summary: 'Recuperation de la liste des invitation Pending' })
  @ApiResponse({ status: 200, description: 'Succes de la Recuperation' })
  @ApiResponse({ status: 400, description: 'Echec de la Recuperation' })
  async getInvitation(@GetUser() user: UserLite, @Res() res: Response) {
    try {
      console.log('FUNCTION GetInvitation Friend was called');
      console.log('JWT User: ', user);

      // CODE ICI
      const data = await this.friendService.getReceivedPendingInvites(user.id);

      return res.status(200).json({ success: true, data: data });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  @Post('sendInvitation') //! => THIS IS THE FUNCTION TO CHANGE
  @ApiOperation({ summary: "Envoie D'une invitation Ami" })
  @ApiResponse({
    status: 200,
    description: "Succes de l'envoie de l'invitation",
  })
  @ApiResponse({
    status: 400,
    description: "Echec de l'envoie de l'invitation",
  })
  @ApiBody({ description: 'Username to Add', type: String })
  async sendInvitation(
    @Body('data')
    data: Pick<Friendship, 'receiverId'>,
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
      const response = await this.friendService.sendFriendInvitation(
        user.id,
        data.receiverId,
      );
      return success.general(res, 'Friend request sent', response);
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      else return error.unexpected(err);
    }
  }

  @Post('resolveInvitation')
  @ApiOperation({ summary: "Envoi de la Resolution d'une requete d'ami" })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  @ApiBody({ description: "La reponse a l'invitation", type: Boolean })
  @ApiBody({ description: 'Username to Add', type: String })
  async resolveInvitation(
    @Body()
    payload: {
      accept: boolean;
      friendShipId: number;
    },
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
      const response =
        (payload.accept &&
          (await this.friendService.acceptFriendInvitation(
            user.id,
            payload.friendShipId,
          ))) ||
        (await this.friendService.declineFriendShip(
          user.id,
          payload.friendShipId,
        ));
      this.lobbyGate.friendShipChange(response);
      return res.status(200).json({ success: true, data: response });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}
