import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategie/';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategie/jwt.strategie';

@Module({
	imports: [JwtModule.register({
		secret: process.env.JWT_SECRET,
		signOptions: { expiresIn: '30d' },
	})],
	controllers: [AuthController],
	providers: [
		AuthService,
		FtStrategy,
		JwtStrategy,
		PrismaService
	]
})
export class AuthModule {}
