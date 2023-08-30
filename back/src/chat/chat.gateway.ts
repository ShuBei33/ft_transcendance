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
import { ChanUsr } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Global, Logger } from '@nestjs/common';
import { UserLite } from '../user/dto';
import { SubscribeMessage } from '@nestjs/websockets';
import { DiscussionLite } from './discussion/dto';
import { DTO_UpdateChanUsr } from './channel/dto';
import { ChannelLite } from './channel/dto/channelLite';
import { JwtService } from '@nestjs/jwt';

// lhs: sid, rhs: userId
const connectedClients = new Map<string, UserLite>();
const socketMap = new Map<string, Socket>();

@Global()
@WebSocketGateway({ namespace: '/chat', cors: '*:*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
	  private friendService: FriendService,
	  private discService: DiscussionService,
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
      this.logger.error('Failed to retrive user, socket disconnected.');
      client.disconnect();
      return;
    }

    connectedClients.set(client.id, user);
    socketMap.set(client.id, client);
    this.logger.log(`Users connected ${JSON.stringify(connectedClients)}`);
    // this.socketService.addClient(user, ENS.CHAT, client);
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
    const discussions: DiscussionLite[] = await this.discService.get_discussions( userId );
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

  	channelNew( channel: ChannelLite ) {
		this.logger.log(`Channel [${channel.id}]:[${channel.name}] was Created`)
		this.wss.emit('channelNew', channel);
	}

	channelSettingsEditedPrivate( chanId: number, channel: ChannelLite ) {
		this.logger.log(`Channel [${chanId}]:[${channel.name}] was Edited`);
		this.wss.to(`chan_${chanId}`).emit('channelPrivateEdited', channel);
	}

	channelSettingsEdited( chanId: number, channel: ChannelLite ) {
		this.logger.log("Channel Public | Protected was Edited");
		this.wss.to(`chan_${chanId}`).emit('channelPrivateEdited', channel)
	}

	channelUserRoleEdited( chanId: number, userUpdate: DTO_UpdateChanUsr) {
		this.logger.log(`User Channel ${userUpdate.id} was Edited`);
		this.wss.to(`chan_${chanId}`).emit('channelUserEdited', userUpdate);
	}

	channelNewUser(chanId: number, user: UserLite) {
		this.logger.log(`User [${user.login}] Join Channel [${chanId}]`);
        this.wss.to(`chan_${chanId}`).emit('userJoinChannel', { user, chanId } );
    }

    channelDelUser(chanId: number, user: UserLite) {
		this.logger.log(`User [${user.login}] Leave Channel [${chanId}]`);
        this.wss.to(`chan_${chanId}`).emit('userLeaveChannel', { user, chanId } );
    }

	async channelRemoved(chanId: number) {
		this.logger.log(`Channel [${chanId}] was removed`);
		const channel: ChannelLite = await this.chanService.get_channel( chanId );
		this.wss.to(`chan_${chanId}`).emit('channelRemoved', channel );
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
		const friendList = await this.friendService.getFriendsList(
		  Number(payload.senderId),
		);
	
		if (friendList.find((User) => User.id === Number(payload.receiverId)))
		  this.wss.to("disc_" + payload.receiverId).emit('message', payload.message);
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
