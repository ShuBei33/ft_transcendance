import { Injectable } from '@nestjs/common';
import { ChannelLite, DTO_UpdateChan, DTO_UpdateChanUsr } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChanUsrRole } from '@prisma/client';
import { error } from 'src/utils/utils_error';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
const logger = new Logger();
//prettier-ignore
@Injectable()
export class ChanAdminService {
	constructor(
		private prisma: PrismaService,
	) {}


	async isAdminChannel( userId: number, chanId: number ) : Promise<ChanUsrRole> {
		const userRole = await this.prisma.chanUsr.findFirst({
			where: {
				chanId: chanId,
				userId: userId,
				role: {
					in: [ChanUsrRole.ADMIN, ChanUsrRole.OWNER]
				}
			},
			select: {
				role: true,
			}
		})
		if (userRole)
			error.notAuthorized("Fonctionnaliter reserver au priviligier")
		return userRole.role;
	}

	async userHasRoleOrThrow(roles: ChanUsrRole[], userId: number, chanId: number) {
		return await this.prisma.chanUsr.findFirstOrThrow({
			where: {
				userId,
				chanId,
				role: {
					in: roles,
				}
			}
		})
	}

	async userHasRole(roles: ChanUsrRole[], userId: number, chanId: number) {
		return await this.prisma.chanUsr.findFirst({
			where: {
				userId,
				chanId,
				role: {
					in: roles,
				}
			}
		})
	}


	async getRoleUser( userId: number, chanId: number ) : Promise<ChanUsrRole> {
		const userRole = await this.prisma.chanUsr.findFirst({
			where: {
				chanId: chanId,
				userId: userId,
			},
			select: {
				role: true,
			}
		})
		return userRole.role;
	}

	async updateUserChannel( chanId: number, userToModify: DTO_UpdateChanUsr): Promise<void> {
		const user = await this.prisma.chanUsr.update({
			where: { id: userToModify.id },
			data: {
				role: userToModify.role,
				status: userToModify.status,
				statusDuration: userToModify.statusDuration,
			}
		})
	}

	async updateChannelSettings( chanId: number, channelModified: DTO_UpdateChan): Promise<ChannelLite> {
		if (["PUBLIC", "PRIVATE"].includes(channelModified.visibility))
			channelModified.hash = null;
		if (channelModified.visibility == "PROTECTED") {
			if (!channelModified.hash)
				error.badRequest("You must provide a password.");
			channelModified.hash = await bcrypt.hash(channelModified.hash, Number(process.env.HASH_SALT_ROUND));
		}
		const channel = await this.prisma.channel.update({
			where: {
				id: chanId,
			},
			data: {
				...channelModified,
			},
			select: {
				id: true,
				name: true,
				visibility: true,
			}
		})
		return channel;
	}

	async kickUserChannel( role: ChanUsrRole, chanId: number, cibleId: number,) {
		if ( role != 'OWNER' && await this.isAdminChannel( chanId, cibleId ) )
			return error.notAuthorized("You cannot kick other admin.");
		await this.prisma.chanUsr.delete({
			where: { id: cibleId },
		})
	}
}
//prettier-ignore-end
