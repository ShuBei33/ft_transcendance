import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LIST_SUFFIX_PSEUDO } from './data';
import { Logger } from '@nestjs/common';
import { UserLite } from 'src/user/dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User } from '@prisma/client';


const logger = new Logger();

@Injectable()
export class AuthService {
	constructor(private jwt: JwtService, private prisma: PrismaService) {}

	async user_validator(login: string): Promise<boolean> {
		try {
			const count = await this.prisma.user.count({ where: { login: login } });
			return (count > 0);
		} catch (error) {
			logger.error("Erreur lors de la validation de l'utilisateur");
			return false;
		}
	}

	async pseudo_validator(pseudo: string) {
		try {
			const count = await this.prisma.user.count({ where: { pseudo: pseudo } });
			return (count > 0);
		} catch (error) {
			logger.error("Erreur lors de la validation du pseudo");
			return false;
		}
	}

	async get_user(login: string): Promise<UserLite> {
		try {
			const user = await this.prisma.user.findFirst({ where: { login: login } });
			const { createdAt, updatedAt, twoFA, avatar, rank, ...rest } = user;
			return rest;
		} catch (error) {
			logger.error("Erreur lors de la recuperation du user");
			return null;
		}
	}

	async pseudo_create(login: string): Promise<string> {
		let pseudo = login + LIST_SUFFIX_PSEUDO[Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)];
		while ( (await this.pseudo_validator(pseudo)) == true )
			pseudo = login + LIST_SUFFIX_PSEUDO[Math.floor(Math.random() * LIST_SUFFIX_PSEUDO.length)];
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

	async signToken( refresh_token: string, access_token: string, login: string ): Promise<{ token: string }>
	{
		const user_lite: UserLite = await this.get_user(login);
		const payload = {
			refresh: refresh_token,
			access: access_token,
			user: user_lite
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
		if ((await this.user_validator(login)) == false) { this.signup(login) }
		return await this.signToken(refresh_token, access_token, login);
	}

	async generate2FASecret(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new Error('User not found');
		}
		const secret = authenticator.generateSecret();
		const otpAuthUrl = authenticator.keyuri(`${user.login}@student.42.fr`, '42', secret);
		
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFASecret: secret,
					otpAuthUrl: otpAuthUrl
				},
			});
		return (toDataURL(otpAuthUrl))
	}

	async turnOn2FA(userId: number) {
		await this.prisma.user.update({
			where: { id: userId },
			data: { twoFA: true },
		});
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: UserLite) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFASecret,
		});
	  }

	  async loginWith2FA(user: UserLite) {
		const payload = {
			login: user.login,
			twoFAEnabled: true,
			twoFAAuthed: true,
		};

		return {
			login: user.login,
			access_token: this.jwt.sign(payload),
		}
	  }

	  //! Raconte moi une blague sur les développeurs
	  // - C'est un développeur qui dit à un autre développeur :
	  // - "Tu connais la blague sur UDP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur TCP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur ICMP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur HTTP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur FTP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SMTP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur POP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur IMAP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur ARP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur RARP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur DHCP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur DNS ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SNMP ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SSL ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur TLS ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SSH ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SSL ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SSL ?"
	  // - "Je ne l'ai pas reçue."
	  // - "Tu connais la blague sur SSL ?"
	  // - "Je ne l'ai pas reçue."


}
