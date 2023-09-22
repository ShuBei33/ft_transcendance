import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { FriendModule } from './friend/friend.module';
import { DiscussionModule } from './chat/discussion/discussion.module';
import { ChannelModule } from './chat/channel/channel.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';

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
		ChatModule
	],
})
export class AppModule {}
