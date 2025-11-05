import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('wechat-login')
  async wechatLogin(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.wechatLogin(loginDto);
  }
}
