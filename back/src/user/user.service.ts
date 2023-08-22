import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from '../utils/utils_error';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';
const logger = new Logger();

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(
    id: number,
    args?: { select: Prisma.UserSelect } | { include: Prisma.UserInclude },
  ) {
    let query = {
      where: {
        id,
      },
    };
    if (args) {
      const argName = Object.entries(args)[0][0];
      query[argName] = args[argName];
    }
    const user = await this.prisma.user.findUnique(query);
    if (!user) error.notFound(`User with id '${id}' does not exists.`);
    return user;
  }
}
