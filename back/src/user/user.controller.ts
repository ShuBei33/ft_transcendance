import { Controller, Get, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { success } from 'src/success_utils';
import { error } from 'src/error_utils';
import { UserService } from './user.service';
import { Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id')
  @ApiOperation({
    summary: "Recuperation d'un utilisateur par id",
  })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 404, description: 'Echec de la Requete' })
  async get(@Res() res: Response, @Param('id', ParseIntPipe) id) {
    const userRes = await this.userService.getUserById(id, {
      select: {
        avatar: true,
        pseudo: true,
        rank: true,
        login: true,
      },
    });
    console.log(id);
    return success.general(res, 'sucess', userRes);
  }
}
