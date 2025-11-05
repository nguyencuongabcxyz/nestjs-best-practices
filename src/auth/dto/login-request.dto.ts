import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  /**
   * The code for verifying the user from WeChat
   * @example '081yFsXh0fYj8F1M8tXh0eJ9hA1yFsXY'
   */
  @IsString()
  @IsNotEmpty()
  code: string;
}
