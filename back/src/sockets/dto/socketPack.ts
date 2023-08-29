import { Socket } from 'socket.io';

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