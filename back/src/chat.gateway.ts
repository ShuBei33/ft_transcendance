import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DiscussionService } from 'src/discussion/discussion.service';
import { ChannelService } from 'src/channel/channel.service';
import { SocketService } from 'src/sockets/socket.service';
import { FriendService } from 'src/friend/friend.service';
import { ChanUsr, Discussion } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserLite } from './user/dto';
import { DTO_SocketChanMessage, DTO_SocketDiscMessage, ENS } from './sockets/dto';
import { SubscribeMessage } from '@nestjs/websockets';
import { DiscussionLite } from './discussion/dto';

@WebSocketGateway({namespace: "/chat", cors: '*:*', })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private chanService: ChannelService,
		private discService: DiscussionService,
		private socketService: SocketService
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
			client.disconnect();
			return;
		}

		if ( this.socketService.isConnected( user.id, ENS.CHAT )) {
			this.logger.error(`USER ${user.login} ALREADY LOGGED IN ChatGateway`);
			client.disconnect();
			return ;
		} else {
			this.logger.log(`USER ${user.login} [${user.id}] CONNECTED on CHAT`);
			this.socketService.addClient(user, ENS.CHAT, client);
			this.joinAllMyDiscs(user.id, client);
			this.joinAllMyChans(user.id, client);
		}
	}

	handleDisconnect(client: Socket) {
		const user = this.socketService.getUser(client.id) || undefined;
		if ( user != undefined ) {
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
			client.join(roomName)
        }
    }

	async joinAllMyDiscs(userId: number, client: Socket) {
        const discussions: DiscussionLite[] = await this.discService.get_discussions(userId);
        for (const discussion of discussions) {
			const roomName: string = 'disc_' + discussion.id; 
			client.join(roomName);
        }
    }

	///////////////////
	//     EVENTS    //
	///////////////////

	@SubscribeMessage("message")
	async message_discussion(client: Socket, data: DTO_SocketDiscMessage): Promise<void> {
		try {
			const user: UserLite = this.socketService.getUser(client.id);
			const validation_body: boolean = await this.discService.isValideDiscusion(user.id, data.discId);
			if ( !validation_body ) {
				this.logger.error(`STOP - Tu essaye de faire des betises donc arrete!`);
				return ;
			}
			this.discService.create_discussion_message(user.id, data);
			this.wss.to("disc_" + data.discId.toString()).emit("message", data.message);
		} catch (e) {
			this.logger.error("EVENT MESSAGE : THROW NOT CATCHED");
		}
	}

	@SubscribeMessage("messageToRoom")
	async message_channel(client: Socket, data: DTO_SocketChanMessage): Promise<void> {

		// RECUPERATION UTILISATEUR
		const user: UserLite = this.socketService.getUser(client.id);

		// CHECK DU BODY ( CHAN ID )



		// const writerChanUsr = await this.chanService.getChanUsr(user.id, );
		// if (writerChanUsr.status == 'NORMAL') {
		// 	this.wss.to("chan_" + data.chanId).emit("message", data.message);
		// }


		
	}
};