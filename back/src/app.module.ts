import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsGateway } from './events.gateway';
import { PongGateway } from './pong.gateway';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';
import { GameService } from './game/game.service';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { UserService } from './user/user.service';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		FriendModule,
		GameModule,
		DiscussionModule,
		ChannelModule,
		UserModule,
		JwtModule
	],
	providers: [
		AppGateway,
		EventsGateway,
		PongGateway,
		GameService,
		UserService
	],
})
export class AppModule {}
