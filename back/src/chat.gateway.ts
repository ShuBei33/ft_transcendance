import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DiscussionService } from 'src/discussion/discussion.service';
import { ChannelService } from 'src/channel/channel.service';
import { SocketService } from './sockets/socket.service';
import { ChanUsr, Discussion } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserLite } from './user/dto';
import { ENS } from './sockets/dto';

@WebSocketGateway({ cors: '*:*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chanService: ChannelService,
    private discService: DiscussionService,
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
    const token = client.handshake.auth.token;
    const user: UserLite = this.socketService.verifyTokenAndGetUser(token);

    if (!user) {
      this.logger.log('Failed to retrive user. Disconnecting socket');
      client.disconnect();
      return;
    }

    if (this.socketService.isConnected(user.id, ENS.CHAT)) {
      this.logger.error(`USER ${user.login} ALREADY LOGGED IN ChatGateway`);
      client.disconnect();
      return;
    } else {
      this.logger.log(`USER ${user.login} [${user.id}] CONNECTED on CHAT`);
      this.socketService.addClient(user, ENS.CHAT, client);
      this.joinAllMyDiscs(user.id, client);
      this.joinAllMyChans(user.id, client);
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.socketService.getUser(client.id) || undefined;
    if (user != undefined) {
      this.socketService.removeClient(user, ENS.CHAT);
      this.logger.log(`USER ${user.login} [${user.id}] DISCONNECTED of CHAT`);
    } else {
      this.logger.error(`USER UNDEFINED`);
    }
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

  // @SubscribeMessage("message")
  // caseMessage(client: Socket, payload: string): void {
  // 	this.serv.emit("message", payload);
  // }
  // @SubscribeMessage("messageToRoom")
  // caseToRoom(client: Socket, payload: any): void {
  // 	this.serv.to(payload.destination).emit("message", payload.message);
  // }
}
