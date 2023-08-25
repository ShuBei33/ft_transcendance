import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Discussion, DiscussionMsg } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { error } from 'src/utils/utils_error';

@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService,
    ) { }

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
            else
                if (e instanceof HttpException)
                    throw e;
                else
                    error.unexpected(e);
        }
    }
}
