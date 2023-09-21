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
import { UserLite } from '../user/dto';
import { UserService } from '../user/user.service';
import { Friendship, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

// lhs: sid, rhs: userId
const connectedClients = new Map<string, UserLite>();
// lhs: sid, rhs: socket
const socketMap = new Map<string, Socket>();

@WebSocketGateway({ namespace: '/lobby', cors: '*:*' })
export class LobbyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwt: JwtService, private userService: UserService) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('LobbyGateway');

  ///////////////////////////////////////////
  //      INIT, CONNECTION, DISCONNECT     //
  ///////////////////////////////////////////

  afterInit(server: Server) {
    this.logger.log('LobbyGateway Initialized');
  }

  verifyTokenAndGetUser(token: string): UserLite | null {
    try {
      const decoded = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded.user;
    } catch (e) {
      return null;
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (socketMap.has(client.id)) {
      this.logger.warn(`Socket $${client.id} already connected.`);
      return;
    }

    const token = client.handshake.auth.token;
    const user: UserLite = this.verifyTokenAndGetUser(token);

    if (!user) {
      this.logger.error('Failed to retrieve user, socket disconnected.');
      client.disconnect();
      return;
    }

    connectedClients.set(client.id, user);
    socketMap.set(client.id, client);
    this.logger.log('br 1');
    this.logger.log(`Users connected ${JSON.stringify(connectedClients)}`);
  }

  handleDisconnect(client: Socket) {
    const user: UserLite = connectedClients.get(client.id);
    if (!user) return;
    this.userService.updateUserStatus(user.id, UserStatus.OFFLINE);
    connectedClients.delete(client.id);
    socketMap.delete(client.id); // lhs: sid, rhs: userId
  }

  getSocketByUserId(userId: number): Socket | undefined {
    let sid = '';
    connectedClients.forEach((user, _sid) => {
      if (user.id == userId) {
        sid = _sid;
        return;
      }
    });
    if (!sid.length) return undefined;
    return socketMap.get(sid);
  }
  ///////////////////
  //     EVENTS    //
  ///////////////////
  friendShipChange(friendship: Friendship) {
    [
      this.getSocketByUserId(friendship.receiverId),
      this.getSocketByUserId(friendship.senderId),
    ].forEach((socket) => {
      if (socket) this.wss.to(socket.id).emit('friendShipChange', friendship);
    });
  }

  friendShipRemove(friendship: Friendship) {
    
  }



  @SubscribeMessage('userStatus')
  handleStatus(
    @MessageBody() newStatus: UserStatus,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('br 2');
    const user: UserLite = connectedClients.get(client.id);
    if (!user) return;
    this.userService.updateUserStatus(user.id, newStatus);
  }
}
