import { Socket } from 'socket.io';

// ENUM NAMESPACE = ENS
export enum ENS {
	CHAT = "chat",
	LOBBY = "lobby",
	GAME = "game"
}

export class SocketPack {
	chat?: Socket;
    lobby?: Socket;
    game?: Socket;
}