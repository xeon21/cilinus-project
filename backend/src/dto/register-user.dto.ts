import { IsString, IsNotEmpty, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user001',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'User password',
    minLength: 4,
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'viewer'],
    example: 'viewer',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'viewer'])
  role: string;
}
