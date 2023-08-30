import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from '../sockets/game.gateway';

@Module({
	imports: [],
	controllers: [GameController],
	providers: [
		GameService,
		GameGateway,
	],
	exports: [GameService]
})
export class GameModule {}
