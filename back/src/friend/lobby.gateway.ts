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
import { UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: "/lobby", cors: '*:*' })
export class LobbyGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
	{
	constructor(
		private jwt: JwtService,
		private userService: UserService,
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
		const token = client.handshake.auth.token;
		const user: UserLite = this.verifyTokenAndGetUser(token);

		if (!user) {
			client.disconnect();
		} else {
			// if (this.isConnected(user.id, ENS.LOBBY)) {
			// this.logger.error(`USER ${user.login} ALREADY LOGGED IN LobbyGateway`);
			// client.disconnect();
			// return;
			// } else {
			this.logger.log(`USER ${user.login} [${user.id}] CONNECTED`);
			// this.addClient(user, ENS.LOBBY, client);
			this.userService.updateUserStatus(user.id, UserStatus.ONLINE);
			this.wss.emit('loginToClient', user.id);
		}
	}
	

	handleDisconnect(client: Socket) {
		// const user = this.getUser(client.id) || undefined;
		// if (user != undefined) {
		// 	// this.removeClient(user, ENS.LOBBY);
		// 	this.logger.log(`USER ${user.login} [${user.id}] DISCONNECTED`);
		// 	this.userService.updateUserStatus(user.id, UserStatus.OFFLINE);
		// 	this.wss.emit('logoutToClient', user.id);
		// } else {
		// 	this.logger.error(`USER UNDEFINED`);
		// }
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

	///////////////////
	//     EVENTS    //
	///////////////////

	@SubscribeMessage('userStatus')
	handleStatus(
		@MessageBody() newStatus: UserStatus,
		@ConnectedSocket() client: Socket,
	) {
		const userId: number = 1; // TODO FAIRE UNE FUNCTION
		this.userService.updateUserStatus(userId, newStatus);
		this.wss.emit('updateStatus', { id: userId, status: newStatus });
	}

	// TODO -> SEND AU 2 USER LE NOUVEAU USER
	// add_friend( user: User, userCible: User ) {
	// 	const client = this.clientsMap.get(user);
	// 	const clientCible = this.clientsMap.get(userCible);
	// 	client.emit('add_friend', userCible);
	// 	clientCible.emit('add_friend', user);
	// }

	// TODO
	// remove_friend( user: UserLite, userCible: number) {
	// 	const client = this.clientsMap.get(user);
	// 	client.emit('remove_friend', userCible);
	// }

	///////////////////
	// TOOLS METHODS //
	///////////////////

	// private clientsMap = new Map<UserLite, Socket>();

	// addClient(user: UserLite, type: ENS, socket: Socket): void {
	//   const client = this.clientsMap.get(user) || {};
	//   client[type] = socket;
	//   this.clientsMap.set(user, client);
	// }
  
	// removeClient(user: UserLite, type: ENS): number {
	// 	const client = this.clientsMap.get(user);
	// 	if (client) {
	// 		this.clientsMap.delete(user);
	// 	}
	// }
  
}
