import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { GameGateway } from './game.gateway';
import { GameModule } from './game/game.module';
// import { GameService } from './game/game.service';
import { LobbyGateway } from './lobby.gateway';
import { FriendModule } from './friend/friend.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { UserService } from './user/user.service';
import { DiscussionService } from './discussion/discussion.service';
import { ChannelService } from './channel/channel.service';
import { FriendService } from './friend/friend.service';
import { SocketService } from './sockets/socket.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		PrismaModule,
		FriendModule,
		GameModule,
		DiscussionModule,
		ChannelModule,
		UserModule,
		JwtModule,
	],
	providers: [
		ChatGateway,
		LobbyGateway,
		UserService,
		DiscussionService,
		ChannelService,
		FriendService,
		SocketService
	],
	exports: []
})
export class AppModule {}
