// backend/src/dto/admin-change-password.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminChangePasswordDto {
  @ApiProperty({
    description: 'New password for the user',
    minLength: 4,
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
