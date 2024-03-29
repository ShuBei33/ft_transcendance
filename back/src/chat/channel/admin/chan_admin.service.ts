import { Injectable } from '@nestjs/common';
import { ChannelLite, DTO_UpdateChan, DTO_UpdateChanUsr } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChanUsr, ChanUsrRole, UserStatusMSGs } from '@prisma/client';
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
		if (!userRole)
			error.notAuthorized("You do not have the correct access rights.")
		return userRole.role;
	}

	// Suggestion 1
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
	
	async userHasStatusOrThrow(statuses: UserStatusMSGs[], userId: number, chanId: number) {
		return await this.prisma.chanUsr.findFirstOrThrow({
			where: {
				userId,
				chanId,
				status: {
					in: statuses,
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

	async updateUserChannel(myRole: ChanUsrRole, chanId: number, userToModify: DTO_UpdateChanUsr): Promise<ChanUsr> {
		const targetUser = await this.prisma.chanUsr.findFirst({
			where: {
				userId: userToModify.id,
				chanId
			}
		});
		if (!targetUser)
			error.notFound("User not member of channel.");
		if (targetUser.role == "OWNER")
			error.notAuthorized("Cannot modify role of the owner.");
		if (myRole == "ADMIN" && targetUser.role == "ADMIN")
			error.notAuthorized("An admin cannot modify another admin's role/status.");
		const { id, ...data } = userToModify;
		return await this.prisma.chanUsr.update({
			where: { id: targetUser.id },
			data,
		});
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

	async kickUserChannel( myRole: ChanUsrRole, chanId: number, targetUserId: number) {
		const targetUserChanUsr = await this.userHasRoleOrThrow(["ADMIN", "OWNER", "NORMAL"], targetUserId, chanId);
		const {role, id} = targetUserChanUsr;
		if (role == "ADMIN" || role == "OWNER")
			error.notAuthorized("You cannot kick admin / owner.");
		return await this.prisma.chanUsr.delete({
			where: {
				id,
			 },
		})
	}
}

//prettier-ignore-end
