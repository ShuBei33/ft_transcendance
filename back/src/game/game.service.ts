import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { error } from 'src/utils/utils_error';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chroma, Game } from '@prisma/client';
import { GameGateway } from 'src/sockets/game.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
// import { GameGateway } from '../game.gateway';
const logger = new Logger();
let queue: number[] = [];

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private chatGate: ChatGateway) {}

  async saveGame(_data: {
    winnerId: number;
    lhsPlayerId: number;
    rhsPlayerId: number;
    lhsScore: number;
    rhsScore: number;
  }) {
    const { winnerId, lhsPlayerId, rhsPlayerId, lhsScore, rhsScore } = _data;
    return await this.prisma.game.create({
      data: {
        lhsScore,
        rhsScore,
        winnerId,
        lhsPlayer: {
          connect: {
            id: lhsPlayerId,
          },
        },
        rhsPlayer: {
          connect: {
            id: rhsPlayerId,
          },
        },
      },
    });
  }

  async userExists(uid: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid,
      },
    });
    if (!user) error.notFound('User not found');
  }

    // await this.gameService.enQueueUser(user.id);
    // return success.general(res, 'You are in queue.');
  async listChroma(): Promise<Chroma[]> {
    return await this.prisma.chroma.findMany();
  }

  async getHistory(uid: number): Promise<Game[]> {
    const history = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            lhsPlayerId: uid,
          },
          {
            rhsPlayerId: uid,
          },
        ],
      },
      include: {
        lhsPlayer: true,
        rhsPlayer: true,
      },
    });
    return history;
  }

  async createGame(userIds: number[]) {
    const gameId: string = String(userIds[0]) + String(userIds[1]);
    logger.log('create game ok!!!!!!!!!!!--=-=-=', gameId);
    for (let i = 0; i < userIds.length; i++) {
      this.chatGate.wss.emit(String(userIds[i]), {
        expect: 'GAME_ID',
        data: gameId,
      });
    }
    logger.log('Users in game' + JSON.stringify(userIds));
  }

  async enQueueUser(userId: number) {
    const isUserInQueue = queue.includes(userId);

    if (isUserInQueue) error.hasConflict('You are already in queue.');
    queue.push(userId);
    if (queue.length == 2) {
      this.createGame([...queue]);
      queue = [];
    }
  }

  async deQueueUser(userId: number) {
    const isUserInQueue = queue.includes(userId);

    if (isUserInQueue) queue = queue.filter((id) => id != userId);
  }
}
