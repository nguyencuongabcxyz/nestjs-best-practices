import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  /**
   * The name of the user
   * @example John Doe
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The name of the user
   * @example John Doe
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
