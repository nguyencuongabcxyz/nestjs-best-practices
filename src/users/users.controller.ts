import { ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserNotFoundError } from './users.errors';
import { ErrorResponse } from 'src/common/filters/catch-all.filter';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { User } from 'generated/prisma/client';
import { UserModel } from './service-model/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  async getUsers(@Query() query: GetUsersQueryDto): Promise<GetUserDto[]> {
    const users = await this.usersService.getUsers(
      query.page || 1,
      query.limit || 10,
    );
    return users.map((user) => UsersController.mapUserToGetUserDto(user));
  }

  /**
   * Create a new user
   */
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<GetUserDto> {
    const createdUser = await this.usersService.createUser(
      UsersController.mapCreateUserDtoToUserModel(user),
    );
    return UsersController.mapUserToGetUserDto(createdUser);
  }

  /**
   * Get a user by ID
   */
  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponse,
  })
  async getUserById(@Param('id') id: string): Promise<GetUserDto> {
    try {
      const user = await this.usersService.getUserById(id);
      return UsersController.mapUserToGetUserDto(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.errorPayload());
      }
      throw error;
    }
  }

  static mapUserToGetUserDto(user: User): GetUserDto {
    return { id: user.id, name: user.name };
  }

  static mapCreateUserDtoToUserModel(dto: CreateUserDto): UserModel {
    return { name: dto.name };
  }
}
