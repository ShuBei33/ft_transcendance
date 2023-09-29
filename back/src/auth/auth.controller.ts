import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FtGuard, JwtGuard } from './guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { FTAuth } from './dto';
import { Logger } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserLite } from 'src/user/dto';
import { HttpException } from '@nestjs/common';

const logger = new Logger();

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @ApiHeader({ name: 'Authorization', description: 'Token d\'authentification' })
  @HttpCode(HttpStatus.OK)
  @Get('checkJWT')
  async checkJWT(@GetUser() user: UserLite) {
    return { user: user };
  }

  @UseGuards(FtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('signin42')
  signin() {}

  @ApiExcludeEndpoint()
  @UseGuards(FtGuard)
  @Get('callback')
  async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = req.user as FTAuth;
    const logger = new Logger();
    const token = await this.authService.signin42(
      data.username,
      data.access_token,
      data.refresh_token,
    );
    const frontEndUrl = `http://localhost:5000/callback`; // Replace with your actual front-end URL
    const redirectUrl = `${frontEndUrl}?token=${token.token}`;
    logger.log(token);
    res.redirect(redirectUrl);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @Post('2fa-turn-on')
  async turnOn2FA(@GetUser() user: UserLite, @Body() body) {
	const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
		body.twoFactorAuthenticationCode,
		user,
	);
	if (!isCodeValid)
		throw new HttpException('Invalid two factor authentication code', HttpStatus.BAD_REQUEST);
	await this.authService.turnOn2FA(user.id);
  }
}

