import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from '../sockets/game.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { FriendModule } from 'src/friend/friend.module';
import { LobbyGateway } from 'src/friend/lobby.gateway';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GameController],
  providers: [UserService, JwtService, LobbyGateway, GameService, GameGateway],
  exports: [GameService, JwtService, UserService, LobbyGateway],
})
export class GameModule {}
