import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DiscussionService } from 'src/discussion/discussion.service';
import { ChannelService } from 'src/channel/channel.service';
import { SocketService } from 'src/sockets/socket.service';
import { FriendService } from 'src/friend/friend.service';
import { ChanUsr, Discussion, Friendship, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserLite } from './user/dto';
import { ENS } from './sockets/dto';
import { SubscribeMessage } from '@nestjs/websockets';

// lhs: sid, rhs: userId
const connectedClients = new Map<string, UserLite>();
const socketMap = new Map<string, Socket>();

@WebSocketGateway({ namespace: '/chat', cors: '*:*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chanService: ChannelService,
    private discService: DiscussionService,
    private friendService: FriendService,
    private socketService: SocketService,
  ) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');

  ///////////////////////////////////////////
  //      INIT, CONNECTION, DISCONNECT     //
  ///////////////////////////////////////////

  afterInit(server: Server) {
    this.logger.log('ChatGateway Initialized');
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
    this.socketService.addClient(user, ENS.CHAT, client);
    this.joinAllMyDiscs(user.id, client);
    this.joinAllMyChans(user.id, client);
  }

  handleDisconnect(client: Socket) {
    connectedClients.delete(client.id);
    socketMap.delete(client.id);
  }

  ///////////////////
  //    METHODES   //
  ///////////////////

  async joinAllMyChans(userId: number, client: Socket) {
    const channels: ChanUsr[] = await this.chanService.getMyChannels(userId);
    for (const channel of channels) {
      const roomName: string = 'chan_' + channel.chanId;
      client.join(roomName);
    }
  }

  async joinAllMyDiscs(userId: number, client: Socket) {
    const discussions: Discussion[] = await this.discService.getAllDiscussions(
      userId,
    );
    for (const discussion of discussions) {
      const roomName: string = 'disc_' + discussion.id;
      client.join(roomName);
    }
  }

  ///////////////////
  //     EVENTS    //
  ///////////////////

  @SubscribeMessage('message')
  async caseMessage(
    client: Socket,
    payload: { senderId: string; receiverId: string; message: string },
  ): Promise<void> {
    const friendList = await this.friendService.getFriendsList(
      Number(payload.senderId),
    );

    if (friendList.find((User) => User.id === Number(payload.receiverId)))
      this.wss.to(payload.receiverId).emit('message', payload.message);
  }

  @SubscribeMessage('messageToRoom')
  async caseToRoom(
    client: Socket,
    payload: { id: string; message: string },
  ): Promise<void> {
    this.logger.log('message received ok bref', payload);
    const writer = connectedClients.get(client.id);
    const writerChanUsr = await this.chanService.getChanUsr(
      Number(writer.id),
      Number(payload.id),
    );
    if (writerChanUsr.status == 'NORMAL') {
      await this.chanService
        .createMessage({
          userId: writer.id,
          channelId: Number(payload.id),
          content: payload.message,
        })
        .then((data) => {
          this.wss.to(`chan_${payload.id}`).emit('message', data);
        });
    }
  }
}
