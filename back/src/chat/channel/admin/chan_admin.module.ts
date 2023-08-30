import { Module } from '@nestjs/common';
import { ChanAdminService } from './chan_admin.service';
import { ChannelModule } from '../channel.module';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';
import { FriendModule } from 'src/friend/friend.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
	imports: [
		DiscussionModule,
		FriendModule,
		ChannelModule,
		JwtModule,
	],
	controllers: [],
	providers: [
		ChanAdminService,
		ChatGateway
	],
	exports: [ChanAdminService],
})
export class ChanAdminModule {}