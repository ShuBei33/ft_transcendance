import { Module } from '@nestjs/common';
import { DiscAdminService } from './disc_admin.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  controllers: [],
  providers: [DiscAdminService, ChatGateway],
  exports: [DiscAdminService],
})
export class DiscAdminModule {}