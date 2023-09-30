import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { error } from 'src/utils/utils_error';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chroma, Game, User } from '@prisma/client';
import { GameGateway } from 'src/sockets/game.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
import { LobbyGateway } from 'src/friend/lobby.gateway';
import { UserLite } from 'src/user/dto';
import * as cron from 'node-cron';
// import { GameGateway } from '../game.gateway';

const logger = new Logger();
let queue: number[] = [];

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private lobbyGate: LobbyGateway) { }

  /* ACHIEVEMENTS */

  async checkBeginnersLuck(userId: number) : Promise<Boolean> {
    const userGames = await this.prisma.game.findMany({
      where: {
        winnerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (userGames.length < 5) {
      return false;
    }
    for (let i = 0; i < 5; i++) {
      const currentGame = userGames[i];
      if (currentGame.winnerId != userId)
        return false;
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        achievements: {
          connect: { title: 'Beginner\'s Luck' },
        },
      },
    });
    return true;
  }

  async checkOneABoveAll(userId: number) : Promise<Boolean> {
    const usrToCheck = await this.prisma.user.findUnique({
      where: {
        id: userId,
        rank: 1,
      },
    });
    if (usrToCheck) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          achievements: {
            connect: { title: 'The One Above All' },
          },
        },
      });
      return true;
    }
    return false;
  }

  async checkSkillGap(userId: number) : Promise<Boolean> {
    const usrToCheck = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        rank: true,
      },
    });
    const gameWithSkillGap = await this.prisma.game.findFirst({
      where: {
        winnerId: userId,
        OR: [
          {
            lhsPlayer: {
              rank: { lte: usrToCheck.rank + 10 },
              NOT: { id: userId },
            },
          },
          {
            rhsPlayer: {
              rank: { lte: usrToCheck.rank + 10 },
              NOT: { id: userId },
            },
          },
        ],
      },
    });
    if (gameWithSkillGap) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          achievements: {
            connect: { title: 'Skill Gap' },
          },
        },
      });
      return true;
    }
    return false;
  }

  async checkCollector(userId: number) : Promise<Boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        chromas: true,
      },
    });
    if (user.chromas.length == 5) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          achievements: {
            connect: { title: 'The Collector' },
          },
        },
      });
      return true;
    }
    return false;
  }

  async saveGame(_data: { winnerId: number; lhsPlayerId: number; rhsPlayerId: number; lhsScore: number; rhsScore: number; }) {

    const { winnerId, lhsPlayerId, rhsPlayerId, lhsScore, rhsScore } = _data;
    const achievementPromises = [];
    [lhsPlayerId, rhsPlayerId].forEach(userId => {
      achievementPromises.push(this.checkBeginnersLuck(userId));
      achievementPromises.push(this.checkOneABoveAll(userId));
      achievementPromises.push(this.checkSkillGap(userId));
      achievementPromises.push(this.checkCollector(userId));
    });
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
    ]);
    await Promise.all(achievementPromises);
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

  /* CHROMA */

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
        money: userMoney - chromaToBuy.price,
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

  /* LEADERBOARD */

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
  
  async calculateWinRate(userId: number): Promise<number> {
    const wins: number = await this.prisma.game.count({
      where: { winnerId: userId }
    });  
    const totalGames: number = await this.prisma.game.count({
      where: {
          OR: [
                { lhsPlayerId: userId },
                { rhsPlayerId: userId },
            ]
        }
    })

    let winRate: number;
    if (totalGames <= 4)
      winRate = (wins / 4) * 100;
    else
      winRate = (wins / totalGames) * 100;
    
    return parseFloat(winRate.toFixed(2));
  }

  async assignRanks() : Promise<void> {
    const allUsers: User[] = await this.prisma.user.findMany();
  
    const userWinRates: { user: User; winRate: number }[] = [];
    for (const user of allUsers) {
      const winRate = await this.calculateWinRate(user.id);
      userWinRates.push({ user, winRate });
    }
    userWinRates.sort((a, b) => b.winRate - a.winRate);
    
    let currentRank = 1;
    let currentWinRate = -1;
    for (let i = 0; i < userWinRates.length; i++) {
      const { user, winRate } = userWinRates[i];
      if (winRate !== currentWinRate) {
        currentRank = i + 1;
        currentWinRate = winRate;
      }
      await this.prisma.user.update({
          where: { id: user.id },
          data: { rank: currentRank },
      });
    }
  }

  async getLeaderboard(): Promise<UserLite[]> {
    const users: User[] = await this.prisma.user.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
    const leaderboard: UserLite[] = users.map((user) => ({
      login: user.login,
      pseudo: user.pseudo,
      id: user.id,
      status: user.status,
    }));
    return leaderboard;
  }

  /* CRONJOBS */
  async startRankAssignmentCronJob(): Promise<void> {
    cron.schedule('*/2 * * *', async () => {
        await this.assignRanks();
    });
  }

  /* GAME */

  async createGame(userIds: number[]) {
    const gameId: string = String(userIds[0]) + String(userIds[1]);
    logger.log('create game ok!!!!!!!!!!!--=-=-=', gameId);
    // for (let i = 0; i < userIds.length; i++) {
    //   this.chatGate.wss.emit(String(userIds[i]), {
    //     expect: 'GAME_ID',
    //     data: gameId,
    //   });
    // }
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
