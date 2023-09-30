import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';

@Injectable()
export class CronService {
  constructor(private readonly gameService: GameService) {}

  async assignRanksCronJob() {
    await this.gameService.assignRanks();
  }
}