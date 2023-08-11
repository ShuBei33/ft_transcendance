import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [JwtModule.register({
		secret: process.env.JWT_SECRET,
		signOptions: { expiresIn: '1h' },
	})],
	controllers: [FriendsController],
	providers: [
		FriendsService,
		PrismaService
	]
})
export class FriendsModule {}
