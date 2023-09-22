import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { DiscussionModule } from '../discussion/discussion.module';
import { FriendModule } from 'src/friend/friend.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		DiscussionModule,
		FriendModule,
		JwtModule,
		UserModule,
	],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService]
})
export class ChannelModule {}