import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { User } from 'generated/prisma/client';
import { UserNotFoundError } from './users.errors';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      getUsers: jest.fn(),
      createUser: jest.fn(),
      getUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const users: User[] = [
        {
          name: 'Alice',
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Bob',
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const getUserDtos: GetUserDto[] = users.map((user) => UsersController.mapUserToGetUserDto(user));
      usersService.getUsers.mockResolvedValue(users);

      const query: GetUsersQueryDto = { page: 1, limit: 10 };
      const result = await controller.getUsers(query);

      expect(result).toEqual(getUserDtos);
      expect(usersService.getUsers).toHaveBeenCalledWith(
        query.page,
        query.limit,
      );
    });

    it('should use default pagination if query params are missing', async () => {
      const users: User[] = [{ name: 'Charlie', id: '3', createdAt: new Date(), updatedAt: new Date() },
      ];
      const getUserDtos: GetUserDto[] = users.map((user) => UsersController.mapUserToGetUserDto(user));
      usersService.getUsers.mockResolvedValue(users);

      const result = await controller.getUsers({} as GetUsersQueryDto);

      expect(result).toEqual(getUserDtos);
      expect(usersService.getUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const dto: CreateUserDto = { name: 'John', email: 'john@example.com' };
      const createdUser: User = { name: 'John', id: '4', createdAt: new Date(), updatedAt: new Date() };
      const getUserDto: GetUserDto = UsersController.mapUserToGetUserDto(createdUser);
      usersService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(dto);

      expect(result).toEqual(getUserDto);
      expect(usersService.createUser).toHaveBeenCalledWith(UsersController.mapCreateUserDtoToUserModel(dto));
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const user: User = { name: 'Jane', id: '5', createdAt: new Date(), updatedAt: new Date() };
      usersService.getUserById.mockResolvedValue(user);

      const result = await controller.getUserById('123');

      expect(result).toEqual(UsersController.mapUserToGetUserDto(user));
      expect(usersService.getUserById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when user is not found', async () => {
      
      const error = new UserNotFoundError('999');
      usersService.getUserById.mockRejectedValue(error);

      await expect(controller.getUserById('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should rethrow other unexpected errors', async () => {
      const unexpectedError = new Error('Database down');
      usersService.getUserById.mockRejectedValue(unexpectedError);

      await expect(controller.getUserById('123')).rejects.toThrow(
        unexpectedError
      );
    });
  });
});
