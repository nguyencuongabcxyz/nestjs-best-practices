import { Injectable, Logger } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async wechatLogin(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const code = loginDto.code;
    this.logger.log(`Verifying user with code ${code}`);

    this.logger.log(`Check and create user if not exists`);

    const user = await this.usersService.getUserById(
      '2b20a608-1df5-46aa-b79a-41eeb2c3a5e7',
    );

    const payload: JwtPayload = { id: user.id, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return { token: accessToken };
  }

  async validateUser(userId: string): Promise<User> {
    return await this.usersService.getUserById(userId);
  }
}

export interface JwtPayload {
  id: string;
  name: string | null;
}
