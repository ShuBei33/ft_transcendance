import { Injectable, Logger } from '@nestjs/common';
import { UserLite } from 'src/user/dto';
import { ENS, SocketPack } from './dto';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

const logger = new Logger();

@Injectable()
export class SocketService {
	constructor( private jwt: JwtService ) {}
	private clientsMap = new Map<UserLite, SocketPack>();

	addClient(user: UserLite, type: ENS, socket: Socket): void {
		const client = this.clientsMap.get(user) || {};
		client[type] = socket;
		this.clientsMap.set(user, client);
	}
	
	removeClient(user: UserLite, type: ENS): number {
		const client = this.clientsMap.get(user);
		if (client) {
			delete client[type];
			logger.log(`Deconnection au namespace ${type}`);
			const length = Object.keys(client).length;
			if ( length=== 0) {
				this.clientsMap.delete(user);
				logger.log(`Deconnection de l'utilisateur: ${user.login}`);
			} else {
				this.clientsMap.set(user, client);
			}
			return length;
		}
		return 0;
	}
	
	getClient(user: UserLite): SocketPack | undefined {
		return this.clientsMap.get(user);
	}

	///////////////////
	// TOOLS METHODS //
	///////////////////

	isConnected( uid: number, type: ENS ) {
		console.log([...this.clientsMap.entries()].find(([key , value]) => (key.id === uid) && value[type]?.id ));

		for (const [key, value] of this.clientsMap) {
			if ( key.id == uid ) {
				console.log( "REAL TRUE ")
				return true;
			}
		}
		console.log( "REAL FALSE ")
		return false
	}

	getUser(sid: string) {
		return [...this.clientsMap.entries()].find(([, value]) => Object.values(value).some(nspSocket => nspSocket?.id === sid))?.[0];
	}

	dispayClientsMap() {
		logger.log('=== number of clients = ' + this.clientsMap.size)
		for (const [key, value] of this.clientsMap) {
			logger.log(`\t User ${key.login} [${key.id}] =\t${{...value}}`); /// ???
		}
	}

	verifyTokenAndGetUser(token: string): UserLite | null {
		try {
			const decoded = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
			return decoded.user;
		} catch (e) {
			return null;
		}
	}
}