import { Injectable, Logger } from "@nestjs/common";
import { ChatGateway } from "src/chat/chat.gateway";
import { DTO_UpdateChanUsr } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ChanUsrRole } from "@prisma/client";

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
}