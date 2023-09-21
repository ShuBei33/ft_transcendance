import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { error } from 'src/utils/utils_error';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chroma, Game, User } from '@prisma/client';
import { GameGateway } from 'src/sockets/game.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
// import { GameGateway } from '../game.gateway';
const logger = new Logger();
let queue: number[] = [];

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private chatGate: ChatGateway) { }

  async saveGame(_data: {
    winnerId: number;
    lhsPlayerId: number;
    rhsPlayerId: number;
    lhsScore: number;
    rhsScore: number;
  }) {
    const { winnerId, lhsPlayerId, rhsPlayerId, lhsScore, rhsScore } = _data;
    const [savedGame, updatedLoserMoney, updatedWinnerMoney] = await this.prisma.$transaction([
      this.prisma.game.create({
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
      }),
      this.prisma.user.update({
        where: {
          id: lhsPlayerId == winnerId ? rhsPlayerId : lhsPlayerId,
        },
        data: {
          money: ((): number => {
            return 50;
          })(),
        }
      }),
      this.prisma.user.update({
        where: {
          id: winnerId,
        },
        data: {
          money: ((): number => {
            return 70;
          })(),
        }
      })
    ])
    return savedGame;
  }

  async userExists(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) error.notFound('User not found');
  }

  // Chroma
  async listChroma(): Promise<Chroma[]> {
    return await this.prisma.chroma.findMany();
  }

  async buyChroma(user: User, id: string): Promise<Chroma> {
    const chromaToBuy = await this.prisma.chroma.findUnique({
      where: {
        id,
      }
    });
    const userMoney = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        money: true,
      }
    }).then(data => data.money);
  
    if (!chromaToBuy)
      error.notFound("Chroma does not exist");
    if (userMoney < chromaToBuy.price)
      error.notAuthorized("You are too poor");
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        money: user.money - chromaToBuy.price,
        chromas: {
          connect: { id },
        }
      }
    })
    return chromaToBuy;
  }

  async chromaById(id: string): Promise<Chroma> {
    return await this.prisma.chroma.findUnique({ where: { id } });
  }

  async getHistory(userId: number): Promise<Game[]> {
    const history = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            lhsPlayerId: userId,
          },
          {
            rhsPlayerId: userId,
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
