import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LIST_SUFFIX_PSEUDO } from './data';
import { Logger } from '@nestjs/common';
import { AuthUser, AuthUserSelect, UserLite } from 'src/user/dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User } from '@prisma/client';
import { UserLiteSelect } from 'src/user/dto';
import { error } from 'src/utils/utils_error';

const logger = new Logger();
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async user_validator(login: string): Promise<boolean> {
    try {
      const count = await this.prisma.user.count({ where: { login: login } });
      return count > 0;
    } catch (error) {
      logger.error("Erreur lors de la validation de l'utilisateur");
      return false;
    }
  }

  async pseudo_validator(pseudo: string) {
    try {
      const count = await this.prisma.user.count({ where: { pseudo: pseudo } });
      return count > 0;
    } catch (error) {
      logger.error('Erreur lors de la validation du pseudo');
      return false;
    }
  }

  async get_user(login: string): Promise<AuthUser> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { login: login },
        select: AuthUserSelect,
      });
      return user;
    } catch (error) {
      logger.error('Erreur lors de la recuperation du user');
      return null;
    }
  }

  async pseudo_create(login: string): Promise<string> {
    let pseudo =
      login +
      LIST_SUFFIX_PSEUDO[Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)];
    while ((await this.pseudo_validator(pseudo)) == true)
      pseudo =
        login +
        LIST_SUFFIX_PSEUDO[
          Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)
        ];
    return pseudo;
  }

  async signup(login: string) {
    const pseudo = await this.pseudo_create(login);
    const user = await this.prisma.user.create({
      data: {
        login,
        pseudo: pseudo,
        rank: 1,
      },
    });
    const { createdAt, updatedAt, twoFA, avatar, rank, ...rest } = user;
    return rest;
  }

  async signToken(
    refresh_token: string,
    access_token: string,
    login: string,
  ): Promise<{ token: string }> {
    const authUser: AuthUser = await this.get_user(login);
    const payload = {
      refresh: refresh_token,
      access: access_token,
      user: authUser,
    };
    const secret = process.env.JWT_SECRET;
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });
    return { token: token };
  }

  async signin42(
    login: string,
    access_token: string,
    refresh_token: string,
  ): Promise<{ token: string }> {
    if ((await this.user_validator(login)) == false) {
      this.signup(login);
    }
    return await this.signToken(refresh_token, access_token, login);
  }

  async generate2FASecret(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      `${user.login}@student.42.fr`,
      '42',
      secret,
    );
    await this.setTwoFactorAuthenticationSecret(secret, userId);
    return otpAuthUrl;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFASecret: secret },
    });
  }

  async toggleTwoFA(userId: number, twoFA: boolean = true) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { twoFA },
      });
    } catch (error) {
      return undefined;
    }
  }

  async is2FAAuthCodeValid(twoFACode: string, userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    logger.log('00000000000000000000 secret', user.twoFASecret);
    return authenticator.verify({ token: twoFACode, secret: user.twoFASecret });
  }

  async generateQRCode(text: string) {
    return toDataURL(text);
  }

  async login2FA(twoFACode: string, userId: number): Promise<boolean> {
    const isCodeValid = await this.is2FAAuthCodeValid(twoFACode, userId);
    if (!isCodeValid) return false;
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        is2FAAuthenticated: true,
      },
    });
    return isCodeValid;
  }
}
