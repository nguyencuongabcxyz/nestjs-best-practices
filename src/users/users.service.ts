import { Injectable, Logger } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/global-services/prisma/prisma.service';
import { UserModel } from './service-model/user.model';
import { UserNotFoundError } from './users.errors';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUsers(page: number, limit: number): Promise<User[]> {
    this.logger.log(`Getting users with page ${page} and limit ${limit}`);
    return await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createUser(user: UserModel): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: user.name,
      },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}
