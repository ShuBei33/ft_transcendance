import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DiscussionService } from 'src/chat/discussion/discussion.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { FriendService } from 'src/friend/friend.service';
import { ChanUsr, StatusInv, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Global, Logger } from '@nestjs/common';
import { UserLite } from '../user/dto';
import { SubscribeMessage } from '@nestjs/websockets';
import { DiscussionLite } from './discussion/dto';
import { DTO_UpdateChanUsr } from './channel/dto';
import { ChannelLite } from './channel/dto/channelLite';
import { JwtService } from '@nestjs/jwt';
import { distinctUntilChanged } from 'rxjs';

// lhs: sid, rhs: userId
const connectedClients = new Map<string, UserLite>();
// lhs: sid, rhs: socket
const socketMap = new Map<string, Socket>();

@Global()
@WebSocketGateway({ namespace: '/chat', cors: '*:*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private friendService: FriendService,
    private dm: DiscussionService,
    private jwt: JwtService,
    private chanService: ChannelService,
  ) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');

  ///////////////////////////////////////////
  //      INIT, CONNECTION, DISCONNECT     //
  ///////////////////////////////////////////

  afterInit(server: Server) {
    this.logger.log('ChatGateway Initialized');
    // console.log(server);
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
    this.logger.log(`Users connected ${JSON.stringify(connectedClients)}`);
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
    const discussions: DiscussionLite[] = await this.dm.getDiscussions(userId);
    for (const discussion of discussions) {
      const roomName: string = 'disc_' + discussion.id;
      client.join(roomName);
    }
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

  //////////////////////////////////
  //    METHODES CHANNEL ADMIN    //
  //////////////////////////////////

  channelNew(channel: ChannelLite) {
    this.wss.emit('channelNew', channel);
  }

  channelSettingsEditedPrivate(chanId: number, channel: ChannelLite) {
    this.wss.to(`chan_${chanId}`).emit('channelPrivateEdited', channel);
  }

  channelSettingsEdited(chanId: number, channel: ChannelLite) {
    this.wss.to(`chan_${chanId}`).emit('channelPrivateEdited', channel);
  }

  channelUserRoleEdited(chanId: number, data: ChanUsr) {
    this.wss.to(`chan_${chanId}`).emit('channelUserEdited', data);
  }

  channelNewUser(chanId: number, user: UserLite) {
    this.wss.to(`chan_${chanId}`).emit('userJoinChannel', { user, chanId });
  }

  channelDelUser(chanId: number, user: UserLite) {
    this.wss.to(`chan_${chanId}`).emit('userLeaveChannel', { user, chanId });
  }

  async channelRemoved(chanId: number) {
    this.logger.log(`Channel [${chanId}] was removed`);
    const channel: ChannelLite = await this.chanService.get_channel(chanId);
    this.wss.to(`chan_${chanId}`).emit('channelRemoved', channel);
  }

  ///////////////////
  //     EVENTS    //
  ///////////////////

  @SubscribeMessage('message')
  async caseMessage(
    client: Socket,
    payload: { senderId: string; receiverId: string; message: string },
  ): Promise<void> {
    try {
      this.logger.log('++++++++++++++++ message received', payload);
      const friendList = await this.friendService.getFriendsList(
        Number(payload.senderId),
        StatusInv.ACCEPTED,
        true,
      );

      const isFriendWithReceiver = (friendList as User[]).find(
        (User) => User.id === Number(payload.receiverId),
      );

      if (isFriendWithReceiver) {
        const disccusionExist = await this.dm.discussionExistOrThrow(
          Number(payload.senderId),
          Number(payload.receiverId),
        );

        await this.dm
          .create_discussion_message(Number(payload.senderId), {
            discId: disccusionExist.id,
            message: payload.message,
          })
          .then((message) => {
            this.wss.to(`disc_${disccusionExist.id}`).emit('dm', message);
          });
      }
    } catch (err) {}
  }

  @SubscribeMessage('messageToRoom')
  async caseToRoom(
    client: Socket,
    payload: { id: string; message: string },
  ): Promise<void> {
    try {
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
    } catch (err) {}
  }
}
