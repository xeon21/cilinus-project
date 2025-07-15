// backend/src/dto/admin-change-password.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AdminChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
