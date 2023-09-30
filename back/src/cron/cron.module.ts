import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { GameService } from 'src/game/game.service';
import { LobbyGateway } from 'src/friend/lobby.gateway';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [CronModule],
  providers: [UserService, JwtService, LobbyGateway, GameService, CronService],
  exports: [UserService, JwtService, LobbyGateway, GameService, CronService]
})
export class CronModule {}