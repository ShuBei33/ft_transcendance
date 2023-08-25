import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FTAuth } from './auth/dto';
import { UserLite } from './user/dto';
import { UserService } from './user/user.service';
import { UserStatus } from '@prisma/client';

@WebSocketGateway({ cors: '*:*', })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor( private jwt: JwtService, private user: UserService ) {}

	private clientsMap = new Map<UserLite, Socket>();
	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');

	afterInit(server: Server) {
		this.logger.log('AppGateway Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {

		// AUTH
		let user: UserLite;
		const token = client.handshake.auth.token;
		try {
			user = (this.jwt.verify(token, { secret: process.env.JWT_SECRET}).user);
		} catch (e) {
			client.disconnect();
		}

		//SAVE_AUTH
		if (this.clientsMap.has(user)) {
			this.logger.error(`USER ${user.login} ALREADY LOGGED IN appGateway`);
			throw new WsException(`double connection`);
		} else {
			this.logger.log(`CLIENT [${user.id}]${user.login} CONNECTED`);
			this.clientsMap.set(user, client);
			// FUNC USER 


			client.broadcast.emit('loginToClient', { userId: user.id, status: UserStatus.ONLINE });
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	  this.wss.emit('message', client.id, data);
	}
	
}