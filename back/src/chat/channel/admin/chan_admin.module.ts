import { Module } from '@nestjs/common';
import { ChanAdminService } from './chan_admin.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  controllers: [],
  providers: [ChanAdminService, ChatGateway],
  exports: [ChanAdminService],
})
export class ChanAdminModule {}