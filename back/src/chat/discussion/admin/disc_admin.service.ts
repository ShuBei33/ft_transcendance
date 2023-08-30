import { Injectable, Logger } from "@nestjs/common";
import { ChatGateway } from "src/chat/chat.gateway";

@Injectable()
export class DiscAdminService {
	constructor(
        private chatGateway: ChatGateway,
	) {}

    private logger: Logger = new Logger('Discussion Admin Service');

	
	
}