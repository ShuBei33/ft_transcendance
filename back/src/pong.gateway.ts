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
    payload: { userId: string; gameId: string },
  ): void {
    this.logger.log(`User ${payload.userId} join game ${payload.gameId}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log('Client with id: ' + client.id + 'is now disconnected');
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.join(client.id);
    this.logger.log('Client with id: ' + client.id + 'just connected');
  }
}
