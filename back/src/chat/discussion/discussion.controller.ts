import { UseGuards, Controller, Get, Delete, Logger } from '@nestjs/common';
import { Param, ParseIntPipe, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { DiscussionService } from './discussion.service';
import { success } from 'src/utils/utils_success';
import { error } from 'src/utils/utils_error';

@UseGuards(JwtGuard)
@ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
@ApiTags('Discussion')
@ApiBearerAuth()
@Controller('discussion')
export class DiscussionController {
  constructor(private discService: DiscussionService) {}

  @Get('all')
  @ApiOperation({ summary: "Retrieve all of a user's discussions" })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  async all(@GetUser() user: User, @Res() res: Response) {
    try {
      const discussions = await this.discService.getDiscussions(user.id);
      return success.general(
        res,
        'All discussions retrieved successfully.',
        discussions,
      );
    } catch {
      return error.hasConflict(' ERROR : /discussion/all ');
    }
  }

  @Get('msgs/:discId')
  @ApiOperation({ summary: 'Retrieve messages of a specific discussion' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  @ApiParam({
    name: 'discId',
    description: 'Discussion ID',
    type: 'number',
    example: 1,
  })
  async getDMs(
    @Param('discId', ParseIntPipe) discId: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    try {
      const discussion = await this.discService.get_discussion(user.id, discId);
      console.log(discussion);
      return success.general(res, 'DMs retrieved successfully.', discussion);
    } catch {
      return error.hasConflict(' ERROR : /discussion/msgs/:discId ');
    }
  }

  @Delete('delete/:msgId')
  @ApiOperation({ summary: 'Delete one of your messages in DM' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  @ApiParam({
    name: 'msgId',
    description: 'Message Id',
    type: 'number',
    example: 1,
  })
  async delete(
    @Param('msgId', ParseIntPipe) msgId: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    try {
      await this.discService.delete_message(user.id, msgId);
      return success.general(res, 'Message deleted successfully.');
    } catch {
      return error.hasConflict(' ERROR : /discussion/msgs/:msgId ');
    }
  }
}
