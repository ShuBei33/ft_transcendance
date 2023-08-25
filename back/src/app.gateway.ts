import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FTAuth } from './auth/dto';
import { UserLite } from './user/dto';
import { UserService } from './user/user.service';
import { User, UserStatus } from '@prisma/client';

@WebSocketGateway({ cors: '*:*', })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor( private jwt: JwtService, private userService: UserService ) {}

	private clientsMap = new Map<UserLite, Socket>();
	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');

	////////////////////////////////////
	//  INIT, CONNECTION, DISCONNECT  //
	////////////////////////////////////

	afterInit(server: Server) {
		this.logger.log('AppGateway Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		let user: UserLite;
		const token = client.handshake.auth.token;
		try {
			user = (this.jwt.verify(token, { secret: process.env.JWT_SECRET}).user);
		} catch (e) {
			client.disconnect();
		}

		if ( this.isConnected( user.id )) {
			this.logger.error(`USER ${user.login} ALREADY LOGGED IN appGateway`);
			client.disconnect();
		} else {
			this.logger.log(`USER ${user.login} [${user.id}] CONNECTED`);
			this.clientsMap.set(user, client);
			this.userService.updateUserStatus(user.id, UserStatus.ONLINE);
			this.wss.emit('loginToClient', user.id);
		}
	}

	handleDisconnect(client: Socket) {
		for (const [user, value] of this.clientsMap) {
			if (client.id === value.id) {
				this.logger.log(`USER ${user.login} [${user.id}] DISCONNECTED`);
				this.userService.updateUserStatus(user.id, UserStatus.OFFLINE);
				this.wss.emit('logoutToClient', user.id);
				this.clientsMap.delete(user);
				break;
			}
		}
	}

	///////////////////
	// TOOLS METHODS //
	///////////////////

	isConnected( uid: number ) {
		for (const [key, value] of this.clientsMap) {
			if ( key.id == uid )
				return true;
		}
		return false
	}

	getUser( sid: string ) {
		for (const [key, value] of this.clientsMap) {
			if ( value.id == sid )
				return key;
		}
	}

	dispayClientsMap() {
		this.logger.log('=== number of clients = ' + this.wss.engine.clientsCount)
		for (const [key, value] of this.clientsMap) {
			this.logger.log(`\t User ${key.login} [${key.id}] =\t${value.id}`);
		}
	}

	//////////////
	//  EVENTS  //
	//////////////
	
	@SubscribeMessage('userStatus')
	handleStatus(@MessageBody() newStatus: UserStatus, @ConnectedSocket() client: Socket) {
		const userId: number = this.getUser( client.id ).id;
		this.userService.updateUserStatus(userId, newStatus);
		this.wss.emit('updateStatus', { id: userId, status: newStatus});
	}







    ////////////////////
    //  CHAT METHODS  //
    ////////////////////

	joinAllDiscussion( socket: Socket, user: UserLite) {

	}

	joinAllChannel( socket: Socket, user: UserLite) {
		// getMyChannels
	}



}