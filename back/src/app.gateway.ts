import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*', })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private clientsMap = new Map<number, Socket>(); // userid / socket associer au user
	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');

	afterInit(server: Server) {
		this.logger.log('AppGateway Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`CLIENT ${client.id} CONNECTED: `);
		console.log(client.handshake.auth);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
	}



	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	  this.wss.emit('message', client.id, data);
	}
	
}