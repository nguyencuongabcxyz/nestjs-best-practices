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
import { User } from 'generated/prisma/client';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { UserNotFoundError } from './users.errors';
import { ErrorResponse } from 'src/common/filters/catch-all.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of results per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of users',
    type: [GetUserDto],
  })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getUsers(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The created user',
    type: GetUserDto,
  })
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.createUser({ name: user.name });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'The user', type: GetUserDto })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponse,
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.errorPayload());
      }
      throw error;
    }
  }
}
