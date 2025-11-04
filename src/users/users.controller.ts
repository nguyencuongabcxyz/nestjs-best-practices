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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  async getUsers(@Query() query: GetUsersQueryDto): Promise<GetUserDto[]> {
    return this.usersService.getUsers(query.page || 1, query.limit || 10);
  }

  /**
   * Create a new user
   */
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<GetUserDto> {
    return this.usersService.createUser({ name: user.name });
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
      return { name: user.name };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.errorPayload());
      }
      throw error;
    }
  }
}
