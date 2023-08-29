import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserLite } from './user/dto';
import { UserService } from './user/user.service';
import { UserStatus } from '@prisma/client';
import { SocketService } from './sockets/socket.service';
import { ENS } from './sockets/dto';

// lhs: sid, rhs: userId
const connectedClients = new Map<string, UserLite>();
const socketMap = new Map<string, Socket>();
@WebSocketGateway({ namespace: '/lobby', cors: '*:*' })
export class LobbyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private socketService: SocketService,
  ) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('LobbyGateway');

  ///////////////////////////////////////////
  //      INIT, CONNECTION, DISCONNECT     //
  ///////////////////////////////////////////

  afterInit(server: Server) {
    this.logger.log('LobbyGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (socketMap.has(client.id)) {
      this.logger.warn(`Socket $${client.id} already connected.`);
      return;
    }

    const token = client.handshake.auth.token;
    const user: UserLite = this.socketService.verifyTokenAndGetUser(token);

    if (!user) {
      this.logger.error('Failed to retrive user, socket disconnected.');
      client.disconnect();
      return;
    }

    connectedClients.set(client.id, user);
    socketMap.set(client.id, client);
    this.logger.log(`Users connected ${JSON.stringify(connectedClients)}`);
    this.userService.updateUserStatus(user.id, UserStatus.ONLINE);
    this.wss.emit('loginToClient', user.id);
  }

  handleDisconnect(client: Socket) {
    const user = connectedClients.get(client.id);
    connectedClients.delete(client.id);
    socketMap.delete(client.id);
    this.userService.updateUserStatus(user.id, UserStatus.OFFLINE);
    this.wss.emit('logoutToClient', user.id);
  }

  //     EVENTS    //
  ///////////////////

  @SubscribeMessage('userStatus')
  handleStatus(
    @MessageBody() newStatus: UserStatus,
    @ConnectedSocket() client: Socket,
  ) {
    const userId: number = this.socketService.getUser(client.id).id;
    this.userService.updateUserStatus(userId, newStatus);
    this.wss.emit('updateStatus', { id: userId, status: newStatus });
  }

  // Gestion de la QUEUE || BOUNCING VERS LE FRONT POUR ARRIVER DANS LES EVENEMENTS GAMES.
}
