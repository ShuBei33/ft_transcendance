import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { GameService } from 'src/game/game.service';
import { LobbyGateway } from 'src/friend/lobby.gateway';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [CronModule, ChatModule],
  providers: [UserService, JwtService,GameService, CronService],
  exports: [UserService, JwtService, GameService, CronService]
})
export class CronModule {}