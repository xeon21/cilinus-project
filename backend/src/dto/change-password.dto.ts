// backend/src/dto/change-password.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: '현재 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'newPassword1234',
    description: '새 비밀번호 (최소 4자 이상)',
    required: true,
    minLength: 4,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
