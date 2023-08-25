import { UseGuards, Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { Param, Body, Query, ParseIntPipe, Res } from '@nestjs/common';
import { Logger } from '@nestjs/common'; // for testing purposes
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { DiscussionService } from './discussion.service';
import { success } from 'src/utils/utils_success';

@UseGuards(JwtGuard)
@ApiTags('Discussion')
@ApiBearerAuth()
@Controller('discussion')
export class DiscussionController {
	constructor(private DiscussionService: DiscussionService) {}

	@Get('all')
	@ApiOperation({ summary: 'Retrieve all of a user\'s discussions' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'discId', description: 'Discussion ID', type: 'number', example: 1 })
	async getMessage(
		@GetUser() user: User,
		@Res() res: Response
	) {
		const DMs = await this.DiscussionService.getAllDiscussions(user.id);
		return success.general(res, "All discussions retrieved successfully.", DMs);
	}

	@Get('msgs/:discId')
	@ApiOperation({ summary: 'Retrieve messages of a specific discussion' })
	@ApiResponse({ status: 200, description: 'Success' })
	@ApiResponse({ status: 400, description: 'Failure' })
	@ApiParam({ name: 'discId', description: 'Discussion ID', type: 'number', example: 1 })
	async getDMs(
		@Param('discId', ParseIntPipe) discId: number,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const DMs = await this.DiscussionService.getDMs(user.id, discId);
		return success.general(res, "DMs retrieved successfully.", DMs);
	}
}
