import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './app.gateway';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ChannelModule } from './channel/channel.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		FriendModule,
		GameModule,
		DiscussionModule,
		ChannelModule,
		UserModule
	],
	providers: [AppGateway],
})
export class AppModule {}
