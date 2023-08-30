import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { DiscussionModule } from "./discussion/discussion.module";
import { ChannelModule } from "./channel/channel.module";
import { ChatController } from "./chat.contoller";

@Module({
    imports: [DiscussionModule, ChannelModule],
    providers: [ ChatGateway, ChatController ],
	exports: [ChatGateway]

})
export class ChatModule {}