import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { EventsGateway } from 'src/events.gateway';

@Module({
  controllers: [GameController],
  providers: [GameService, EventsGateway]
})
export class GameModule {}
