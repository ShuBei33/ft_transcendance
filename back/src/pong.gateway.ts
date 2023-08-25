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
import Pong from './game/pongEngine';

interface PongInstance {
  playersUserIds: number[];
  spectatorIds?: number[];
  engine: Pong | undefined;
}

const games = new Map<number, PongInstance>();
const connectedClients = new Map<string, Socket>();
const isGamePlayersLocked = (instance: PongInstance) =>
  instance.playersUserIds.length == 2;

//TODO Cors
@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() serv: Server;
  private logger: Logger = new Logger('EventsGateway');
  afterInit(serv: any) {
    this.logger.log('Init');
  }
  @SubscribeMessage('joinGame')
  caseMessage(
    client: Socket,
    payload: { userId: number; gameId: number },
  ): void {
    // saving 'this' for Pong callback context
    const _this = this;

    this.logger.log(`User ${payload.userId} join game ${payload.gameId}`);
    if (games.has(payload.gameId)) {
      let pongInstance = games.get(payload.gameId);
      if (!isGamePlayersLocked(pongInstance)) {
        pongInstance.playersUserIds.push(payload.userId);
        if (isGamePlayersLocked(pongInstance)) {
          pongInstance.engine = new Pong(
            {
              onUpdate(data) {
                _this.logger.log(data);
                _this.serv.volatile.emit(`game: ${String(payload.gameId)}`, {
                  expect: 'update',
                  data,
                });
              },
              onGameEnd() {
                games.delete(payload.gameId);
              },
            },
            // (data) => {
            //
            // },
            { width: 800, height: 600 },
          );
          pongInstance.engine.startGame();
          this.logger.log('Game can start', pongInstance);
        }
      }
      games.set(payload.gameId, pongInstance);
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
        const pongInstance = games.get(gameId);
        if (pongInstance) {
          pongInstance.engine.stopGame((gameData) => {});
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
