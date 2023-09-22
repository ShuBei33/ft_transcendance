import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Post, HttpException, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { success } from 'src/utils/utils_success';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { Param } from '@nestjs/common';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorator';
import { UserLite } from './dto';
import { error } from 'src/utils/utils_error';

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
    const userRes = await this.userService.getUserById(id, {
      select: {
        avatar: true,
        pseudo: true,
        rank: true,
        login: true,
        achievements: true,
        chromas: id == user.id,
      },
    });
    return success.general(res, 'sucess', userRes);
  }

  @Post('changePseudo')
  @ApiOperation({ summary: "Changement du pseudo d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Succes de la Requete' })
  @ApiResponse({ status: 404, description: 'Echec de la Requete' })
  @ApiBody({ description: 'Pseudo to replace', type: String })
  async changePseudo(
	@Body('pseudo') pseudo: string,
	@GetUser() user: UserLite,
	@Res() res: Response,
	) {
		const userRes = await this.userService.changePseudo(user.id, pseudo);
		return success.general(res, 'Pseudo changed successfully', userRes);
	} catch (err: any) {
		if (err instanceof HttpException) throw err;
		else return error.unexpected(err);
	}

}
