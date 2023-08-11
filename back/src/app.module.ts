import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './app.gateway';
import { FriendsModule } from './friends/friends.module';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		FriendsModule
	],
	controllers: [],
	providers: [AppGateway],
})
export class AppModule {}
