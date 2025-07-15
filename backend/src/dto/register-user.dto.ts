import { IsString, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'viewer'])
  role: string;
}
