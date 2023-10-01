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
  Post,
  Body,
  Logger,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { success } from 'src/utils/utils_success';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { Param } from '@nestjs/common';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorator';
import { AuthUserSelect, UserLite } from './dto';
import { UserLiteSelect } from './dto';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: "Recuperation d'un utilisateur par id" })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 404, description: 'Echec de la Requete' })
  @ApiParam({ name: 'id', description: 'userId', type: 'number', example: 1 })
  async get(
    @GetUser() user: UserLite,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const select =
      user.id == id ? AuthUserSelect : { ...UserLiteSelect, rank: true };
    const userRes = await this.userService.getUserById(id, {
      select,
    });
    return success.general(res, 'sucess', userRes);
  }

  @Post('updateNick/:id/:pseudo')
  @ApiOperation({ summary: "User can modify his/her nickname" })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Failure' })
  @ApiParam({ name: 'id', description: 'userId', type: 'number', example: 1 })
  async updateNick(
    @GetUser() user: UserLite,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Param('pseudo') pseudo: string,
  ) {
    try {
      await this.userService.updateUserNick(id, pseudo);
      return success.general(res, 'success');
    }
    catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
}
