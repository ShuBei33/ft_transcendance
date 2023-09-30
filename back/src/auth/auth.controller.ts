import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FtGuard, JwtGuard } from './guard';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { FTAuth } from './dto';
import { Logger } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserLite } from 'src/user/dto';
import { User } from '@prisma/client';
import { success } from 'src/utils/utils_success';
import { error } from 'src/utils/utils_error';

const logger = new Logger();

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
  @HttpCode(HttpStatus.OK)
  @Get('checkJWT')
  async checkJWT(@GetUser() user: User) {
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
  @UseGuards(JwtGuard)
  @Get('2fa/generate')
  async generate(
    @Res() res: Response,
    @Req() req: Request,
    @GetUser() user: User,
  ) {
    const otpAuthUrl = await this.authService.generate2FASecret(user.id);
    // return success.general(res, 'ok', otpAuthUrl);
    return res.json(await this.authService.generateQRCode(otpAuthUrl));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @Post('2fa/turnOn')
  async turnOn2FA(@Req() request, @Body() body, @Res() res: Response) {
    const isCodeValid = this.authService.is2FAAuthCodeValid(
      body.twoFA,
      request.user,
    );
    if (!isCodeValid) error.notAuthorized('Code invalid');
    const user = await this.authService.toggleTwoFA(request.user.id);
    if (user) return success.general(res, 'success');
    return error.unexpected('An unexpected error occurred')
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @Post('2fa/turnOff')
  async turnOff2FA(@Req() request, @Body() body, @Res() res: Response) {
    const isCodeValid = this.authService.is2FAAuthCodeValid(
      body.twoFA,
      request.user,
    );
    if (!isCodeValid) error.notAuthorized('Code invalid');
    const user = await this.authService.toggleTwoFA(request.user.id, false);
    if (user) return success.general(res, 'success');
    return error.unexpected('An unexpected error occurred')
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard)
  @Post('2fa/authenticate')
  @HttpCode(200)
  async authenticate2FA(
    @Req() request,
    @Res() res: Response,
    @Body('data')
    data: {
      twoFACode: string;
    },
  ) {
    const isCodeValid = this.authService.is2FAAuthCodeValid(
      data.twoFACode,
      request.user,
    );
    if (!isCodeValid) {
      throw new HttpException(
        'Invalid two-factor authentication code',
        HttpStatus.BAD_REQUEST,
      );
    }
    return success.general(res, 'success');
  }
}
