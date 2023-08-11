import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FtGuard, JwtGuard } from '../auth/guard';
import { Request, Response } from 'express';
import { FriendsService } from './friends.service';
import { GetToken, GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('friends')
export class FriendsController {
	constructor(private friendService: FriendsService) {}

	// @UseGuards(JwtGuard)
	// @Get('addFriend')
	// async addFriend(@GetUser() user, UserToAdd) {
	// 	// console.log("tokens: ", tokens);
	// 	// const { createdAt, updateAt, twoFA, ...rest } = user;
	// 	return this.friendService.addFriend(UserToAdd);
	// }

    @UseGuards(JwtGuard)
	@Get('getFriendsListByUserId')
	async getFriendsListByUserId(@GetUser() user: User) {
		// console.log("tokens: ", tokens);
		// const { createdAt, updateAt, twoFA, ...rest } = user;
		return this.friendService.getFriendsListByUserId( user.id );
	}

}
