import { Module } from '@nestjs/common';
import { DiscAdminService } from './disc_admin.service';

@Module({
	controllers: [],
	providers: [DiscAdminService],
	exports: [DiscAdminService],
})
export class DiscAdminModule {}