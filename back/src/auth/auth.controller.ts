import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FtGuard, JwtGuard } from './guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GetToken, GetUser } from './decorator';
import { FTAuth } from './dto';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('checkJWT')
  async checkJWT(@GetUser() user, @GetToken() tokens) {
    console.log('user: ', user);
    console.log('tokens: ', tokens);
    const { createdAt, updateAt, twoFA, ...rest } = user;
    return { user: rest };
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('test')
  async test(@GetUser() user) {
    return user;
  }

  @UseGuards(FtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('signin42')
  signin() {}

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
    const frontEndUrl = `http://localhost:5000/callback`;
    const redirectUrl = `${frontEndUrl}?token=${token.token}`;
    res.redirect(redirectUrl);
  }
}
