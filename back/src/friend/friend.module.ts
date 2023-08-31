import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { LobbyGateway } from './lobby.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';

@Module({
	imports: [JwtModule, UserModule, DiscussionModule ],
	controllers: [FriendController],
	providers: [FriendService, LobbyGateway],
	exports: [FriendService]
})
export class FriendModule {}
