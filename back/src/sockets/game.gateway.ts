import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import Pong from 'src/game/pongEngine';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from 'src/game/game.service';

interface PongInstance {
  playersUserIds: number[];
  spectatorIds?: number[];
  engine: Pong | undefined;
}

const gameMaxPoints = 3;
const games = new Map<number, PongInstance>();
const connectedClients = new Map<string, Socket>();
// Utils functions
const isGamePlayersLocked = (instance: PongInstance) =>
  instance.playersUserIds.length == 2;
// First user in array of playersUserIds is playerOne
const userIdToPlayer = (
  userId: number,
  instance: PongInstance,
): 'playerOne' | 'playerTwo' => {
  return instance.playersUserIds.indexOf(userId) == 0
    ? 'playerOne'
    : 'playerTwo';
};

//TODO Cors
@WebSocketGateway({ namespace: '/game', cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  constructor(private gameService: GameService) {}
  @WebSocketServer() serv: Server;
  private logger: Logger = new Logger('Pong Gateway');
  private prismaService: PrismaService;
  afterInit(serv: any) {
    this.logger.log('Init');
  }

  @SubscribeMessage('keyStroke')
  keyStoke(client: Socket, e: { key: string; down: boolean }) {
    connectedClients.forEach((socket, identification) => {
      if (socket == client) {
        const { userId, gameId }: { userId: number; gameId: number } =
          JSON.parse(identification);
        const instance = games.get(gameId);
        if (instance) {
          if (userIdToPlayer(userId, instance) == 'playerOne') {
            e.key = e.key == 'a' ? 'ArrowLeft' : e.key;
            e.key = e.key == 'd' ? 'ArrowRight' : e.key;
          }
          instance.engine.registerKeyStroke(e);
        }
        return;
      }
    });
  }

  @SubscribeMessage('joinGame')
  joinGame(client: Socket, payload: { userId: number; gameId: number }): void {
    // saving 'this' for Pong callback context
    const _this = this;

    this.logger.log(`User ${payload.userId} join game ${payload.gameId}`);
    if (games.has(payload.gameId)) {
      let instance = games.get(payload.gameId);
      if (!isGamePlayersLocked(instance)) {
        instance.playersUserIds.push(payload.userId);
        if (isGamePlayersLocked(instance)) {
          instance.engine = new Pong(
            {
              onUpdate(data) {
                // There is a winner
                if (
                  data.playerOnePoints == gameMaxPoints ||
                  data.playerTwoPoints == gameMaxPoints
                ) {
                  //  Disconnecting loser socket (first user to disconnect is looser by default)
                  const looserIdIndex =
                    data.playerOnePoints > data.playerTwoPoints ? 0 : 1;
                  connectedClients.forEach((socket, identification) => {
                    const {
                      userId,
                      gameId,
                    }: { userId: number; gameId: number } =
                      JSON.parse(identification);
                    if (userId == instance.playersUserIds[looserIdIndex]) {
                      _this.logger.log(
                        '+++++++++++++++++ Loser disconnected',
                        userId,
                      );
                      socket.disconnect();
                      return;
                    }
                  });
                } // No winner yet, game data is sent to players
                else
                  _this.serv.volatile.emit(`game: ${String(payload.gameId)}`, {
                    expect: 'update',
                    data,
                  });
              },
              onGameEnd() {
                // Disconnect all players if connected and remove game locally
                connectedClients.forEach((socket, identification) => {
                  const { userId, gameId }: { userId: number; gameId: number } =
                    JSON.parse(identification);
                  if (instance.playersUserIds.indexOf(userId) != -1)
                    socket.connected && socket.disconnect();
                });
                games.delete(payload.gameId);
              },
            },
            [], // Starts with empty keystrokes
            { width: 800, height: 600 },
          );
          instance.engine.startGame();
          this.logger.log('Game can start', instance);
        }
      }
      games.set(payload.gameId, instance);
    } else {
      games.set(payload.gameId, {
        playersUserIds: [payload.userId],
        engine: undefined,
      });
    }
  }

  handleDisconnect(client: Socket) {
    connectedClients.forEach((socket, identification) => {
      if (socket == client) {
        const { userId, gameId }: { userId: number; gameId: number } =
          JSON.parse(identification);
        const instance = games.get(gameId);

        if (instance) {
          if (instance.engine && instance.engine.gameIsRunning) {
            (async () => {
              await instance.engine.stopGame().then(async (gameData) => {
                const winnerId = instance.playersUserIds.filter(
                  (id) => id != userId,
                )[0];
                const lhsPlayerId = instance.playersUserIds[0];
                const rhsPlayerId = instance.playersUserIds[1];
                console.log(
                  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!gameData',
                  gameData,
                );
                // save game in db
                await this.gameService.saveGame({
                  winnerId,
                  lhsPlayerId,
                  rhsPlayerId,
                  lhsScore: gameData.playerTwoPoints,
                  rhsScore: gameData.playerOnePoints,
                });
              });
            })();
          }
        }
        return;
      }
    });
    this.logger.log('Client with id: ' + client.id + 'is now disconnected');
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.join(client.id);
    client.on(
      'identification',
      (payload: { userId: number; gameId: string }) => {
        const payloadStringify = JSON.stringify(payload);
        const socketExist = connectedClients.get(payloadStringify);
        if (socketExist) socketExist.disconnect();
        connectedClients.set(payloadStringify, client);
        this.logger.log(`User ${payload.userId} is authorized`);
      },
    );
    this.logger.log('Client with id: ' + client.id + 'just connected');
  }
}
