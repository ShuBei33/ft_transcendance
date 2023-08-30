import { Injectable, Logger } from "@nestjs/common";
import { ChatGateway } from "src/chat/chat.gateway";
import { DTO_UpdateChan, DTO_UpdateChanUsr } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ChanUsrRole } from "@prisma/client";
import { error } from "src/utils/utils_error";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChanAdminService {
	constructor(
        private chatGateway: ChatGateway,
		private prisma: PrismaService,
	) {}

    private logger: Logger = new Logger('Channel Admin Service');

	async isAdminChannel( userId, chanId ) : Promise<boolean> {
		const user = await this.prisma.chanUsr.findFirst({
			where: {
				chanId: chanId,
				userId: userId,
				role: ( ChanUsrRole.ADMIN || ChanUsrRole.OWNER )
			}
		})
		if (!user)
			return false;
		return true;
	}

	async updateChanUsr( chanId: number, userToModify: DTO_UpdateChanUsr): Promise<void> {
		const user = await this.prisma.chanUsr.update({
			where: { id: userToModify.id },
			data: {
				role: userToModify.role,
				status: userToModify.status,
				statusDuration: userToModify.statusDuration,
			}
		})
		if (user)
			this.chatGateway.channelUserRoleEdited(chanId, userToModify)
	}

	async updateChannelSettings( chanId: number, channelModified: DTO_UpdateChan): Promise<void> {
		if (["PUBLIC", "PRIVATE"].includes(channelModified.visibility))
			channelModified.hash = null;
		if (channelModified.visibility == "PROTECTED" && !channelModified.hash)
			error.badRequest("You must provide a password.");
		if (channelModified.hash)
			channelModified.hash = await bcrypt.hash(channelModified.hash, process.env.HASH_BCRYPT);
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
		if (channelModified.visibility == 'PRIVATE') {
			this.chatGateway.channelSettingsEditedPrivate( chanId, channel );
		} else {
			this.chatGateway.channelSettingsEdited( chanId, channel );
		}
	}
}