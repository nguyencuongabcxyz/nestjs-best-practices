import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/global-services/prisma/prisma.service';
import { UserModel } from './service-model/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async createUser(user: UserModel): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: user.name,
      },
    });
  }
}
