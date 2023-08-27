import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Discussion, DiscussionMsg } from '@prisma/client';
import { UserStatusMSGs } from '@prisma/client';
import { DTORestrainUsr } from './dto';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';

@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService,
    ) { }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Creation		                                                                    //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    // Unsure about these functions. It should be triggered when someone sends the first message
    // so it must go hand in hand with a discussionMsg creation (sockets???)

    async createDiscussion(userId: number, secondUserId: number): Promise<Discussion> {
        try {
            // check that friendship exists between the two parties
            const hasFriendship = await this.prisma.friendship.findFirst({
                where: { 
                    inviteStatus: 'ACCEPTED',
                    OR: [
                        { senderId: userId, receiverId: secondUserId },
                        { senderId: secondUserId, receiverId: userId },
                      ], }
            })
            if (!hasFriendship)
                error.notFound('You can only send DMs to a friend.');

            // create new instance: the initial sender, userId, becomes user1
            const newDiscussion = await this.prisma.discussion.create({
                data: {
                    user1: { connect: { id: userId } },
                    user2: { connect: { id: secondUserId } },
                }
            });
            return newDiscussion;
        } 
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.hasConflict(`This discussion already exists.`);
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    async createDiscussionMSG(userId: number, secondUserId: number, content: string): Promise<DiscussionMsg> {
        try {
            // check that discussion exists
            const hasDiscussion = await this.prisma.discussion.findFirst({
                where: {
                    OR: [
                        { userId1: userId, userId2: secondUserId },
                        { userId1: secondUserId, userId2: userId },
                      ], }
                    
            })
            if (!hasDiscussion)
                error.notFound('You can only send DMs to a friend.');

            // check that user has the right to send a message
            const userStatus = userId === hasDiscussion.userId1 ? hasDiscussion.user1Status : hasDiscussion.user2Status;
            if (userStatus !== 'NORMAL')
                error.notAuthorized('You cannot send a message at the moment.');

            // create new instance: userId is the sender
            const newDiscussionMSG = await this.prisma.discussionMsg.create({
                data: {
                    content,
                    user: { connect: { id: userId } },
                    discussion: { connect: { id: hasDiscussion.id } }
                }
            });
            return newDiscussionMSG;
        } 
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.hasConflict(`This discussion already exists.`);
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Retriever		                                                                    //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    async getAllDiscussions(userId: number): Promise<Discussion[]> {
        try {
            // only get my discussions
            const discussions = await this.prisma.discussion.findMany({
                where: { 
                    OR: [
                    { userId1: userId },
                    { userId2: userId },
                  ], }
            })
            if (discussions.length === 0) // strict equality operator
                error.notFound('You don\'t have any discussions yet.');
            return discussions;
        }
        catch (e) {
            if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    async getDMs(userId: number, discId: number): Promise<DiscussionMsg[]> {
        try {
            // get the specified discussion
            await this.prisma.discussion.findFirstOrThrow({
                where: {
                    id: discId,
                    OR: [
                        { userId1: userId },
                        { userId2: userId },
                      ], }
                }
            )
            // extract all the messages of that discussion
            const messages = await this.prisma.discussionMsg.findMany({
                where: { discussionId: discId }
            })
            if (messages.length === 0) // strict equality operator
                error.notFound('There aren\'t any messages at the moment.')
            return messages;
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notAuthorized('You are not allowed to access this discussion.')
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //																							//
    //		Muting / blocking a user		                                                    //
    //																							//
    //////////////////////////////////////////////////////////////////////////////////////////////

    async muteOrBlockUser(userId: number, newDTORestrainUsr: DTORestrainUsr): Promise<void> {
        try {
            const { discId, restrainedId, user1Status, user2Status } = newDTORestrainUsr;
            // get the specified discussion
            const hasDiscussion = await this.prisma.discussion.findFirstOrThrow({
                where: {
                    id: discId,
                    OR: [
                        { userId1: userId, userId2: restrainedId },
                        { userId1: restrainedId, userId2: userId },
                      ], }
                }
            )
            // check that you're not trying to change your own status
            const whichUserAmI = userId === hasDiscussion.userId1 ? hasDiscussion.user1Status : hasDiscussion.user2Status;
            if ((whichUserAmI == user1Status && user1Status) || (whichUserAmI == user2Status && user2Status) )
                error.notAuthorized('You cannot mute or block yourself.');
            
            // update the status accordingly
            await this.prisma.discussion.update({
                where: { id: discId },
                data: { user1Status, user2Status}
            })
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                error.notFound('Discussion with this user not found.')
            else if (e instanceof HttpException)
                throw e;
            else
                error.unexpected(e);
        }
    }
}
