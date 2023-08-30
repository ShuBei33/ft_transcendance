import { ChanAdminModule } from "./channel/admin/chan_admin.module";
import { DiscussionModule } from "./discussion/discussion.module";
import { ChannelModule } from "./channel/channel.module";
import { FriendModule } from "src/friend/friend.module";
import { ChatController } from "./chat.contoller";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { ChatGateway } from "./chat.gateway";

@Global()
@Module({
    imports: [
		FriendModule,
		DiscussionModule,
		JwtModule,
		ChannelModule,
		ChanAdminModule,
		UserModule
	],
	controllers: [
		ChatController
	],
    providers: [
		ChatGateway
	],
	exports: [
	]

})
export class ChatModule {}