import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common';
import { GameService } from './game.service';
@Global()
@Module({
  providers: [GameService],
  exports: [GameService],
})
export class GlobalGameModule {}
