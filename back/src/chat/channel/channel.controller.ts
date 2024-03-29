import { UseGuards, Controller, Get, Post, Delete, Patch, Inject, forwardRef } from '@nestjs/common';
import { Param, Body, ParseIntPipe, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { DTO_CreateChan, DTO_JoinChan, DTO_InviteChan, DTO_UpdateChan, DTO_UpdateChanUsr } from './dto';
import { success } from 'src/utils/utils_success';
import { error } from 'src/utils/utils_error';
import { UserLite } from 'src/user/dto';

// const logger = new Logger();

@UseGuards(JwtGuard)
@ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
@ApiTags('Channel')
@ApiBearerAuth()
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all non-private channels' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  async getAll(@Res() res: Response) {
    try {
          const channelList = await this.channelService.getAllChannels();
          return success.general(res, 'Available channels list retrieved successfully', channelList);  
    }
    catch (e: any) {
          return error.unexpected('Error while retrieving available channels.');
    }
  }

  @Get('mine')
  @ApiOperation({ summary: 'Retrieve a list of subscribed channels' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  async getMine(@GetUser() user: UserLite, @Res() res: Response) {
    try {
          const channelList = await this.channelService.getMyChannels(user.id);
          return success.general(res, 'Subscribed channels list retrieved successfully.', channelList,);
    }
    catch (e: any) {
          return error.unexpected('Error while retrieving subsribed channels list.');
    }
  }

  @Get('msgs/:chanId')

  @ApiOperation({ summary: "Retrieve a channel's messages" })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  @ApiParam({ name: 'chanId', description: 'Channel ID', type: 'number', example: 1, })
  async getMessage(
    @Param('chanId', ParseIntPipe) chanId: number,
    @GetUser() user: UserLite,
    @Res() res: Response,
  ) {
    try {
          const channelMsgs = await this.channelService.getChannelMsgs(user.id, chanId );
          return success.general(res, 'Channel messages retrieved successfully.', channelMsgs);
    }
    catch (e: any) {
          if (e instanceof PrismaClientKnownRequestError)
              error.notAuthorized('You are not allowed to access this channel.');
          else
              return error.unexpected('Error while retrieving channel messages.');
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failure' })
  async create(
    @GetUser() user: UserLite,
    @Body() channelToCreate: DTO_CreateChan,
    @Res() res: Response,
  ) {
    try {
          const createdChannel = await this.channelService.createChannel(user.id, channelToCreate);
          return success.general(res, 'Channel created successfully', createdChannel);
    }
    catch (e: any) {
          if (e instanceof PrismaClientKnownRequestError)
              error.hasConflict('Channel already exists.');
          else
              return error.unexpected('Error while creating a new channel.');
    }
  }
}
