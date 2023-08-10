import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './app.gateway';

@Module({
	imports: [
		AuthModule,
		PrismaModule,
	],
	controllers: [],
	providers: [AppGateway],
})
export class AppModule {}
