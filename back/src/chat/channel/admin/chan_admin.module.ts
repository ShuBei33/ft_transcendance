import { Module, forwardRef } from '@nestjs/common';
import { ChanAdminService } from './chan_admin.service';
import { ChannelModule } from '../channel.module';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';
import { FriendModule } from 'src/friend/friend.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [
		DiscussionModule,
		FriendModule,
		ChannelModule,
		JwtModule,
		forwardRef(() => ChatModule),
	],
	controllers: [],
	providers: [
		ChanAdminService,
	],
	exports: [ChanAdminService],
})
export class ChanAdminModule {}