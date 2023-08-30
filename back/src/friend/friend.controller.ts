import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from 'src/auth/guard';
import { Friendship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Response } from 'express';
import {
  ApiBearerAuth,
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
const logger = new Logger();
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('get')
  @ApiOperation({
    summary: "Recuperation de la liste d'amis de l'utilisateur en court",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 400, description: 'Echec de la Requete' })
  async get(@GetUser() user: UserLite, @Res() res: Response) {
    try {
      // CODE ICI
      const data = await this.friendService.getFriendsList(user.id);
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
      console.log('FUNCTION Remove Friend was called');
      console.log('JWT User: ', user);
      console.log('User Id Cible: ', uid);

      await this.friendService.deleteFriend(user.id, uid); //! Maybe change uid to a string ? idk...
      await this.friendService.deleteFriend(uid, user.id); //! Cause the user is not going to give an id right ? Or maybe we show id in the front ?

      return res.status(200).json({ success: true });
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

  @Post('sendInvitation')
  @ApiOperation({ summary: "Envoie D'une invitation Ami" })
  @ApiResponse({
    status: 200,
    description: "Succes de l'envoie de l'invitation",
  })
  @ApiResponse({
    status: 400,
    description: "Echec de l'envoie de l'invitation",
  })
  async sendInvitation(
    @Body('data')
    data: Pick<Friendship, 'receiverId'>,
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
      Logger.log('@2222222222222222222222', data);
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
  async resolveInvitation(
    @Body() answer: boolean,
    @Body() fromUser: string,
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
      console.log('FUNCTION ResolveInvitation Friend was called');
      console.log('JWT User: ', user);
      console.log('Answer Invitation: ', answer);

      const response = await this.friendService.acceptFriendInvitation(
        user.id,
        answer,
        fromUser,
      );

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}
