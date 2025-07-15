import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { UserDto } from '../dto/user.dto';
import { UpdateUserRoleDto } from '../dto/user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AdminChangePasswordDto } from '../dto/admin-change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepository: AdminRepository) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<void> {
    const { userId, password } = registerUserDto;

    const existingUser = await this.adminRepository.findByUserId(userId);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 유저 아이디입니다.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this.adminRepository.createUser(registerUserDto, hashedPassword);
  }

  async getUsers(): Promise<UserDto[]> {
    return this.adminRepository.getUsers();
  }

  async updateUserRole(userIdx: number, updateUserRoleDto: UpdateUserRoleDto): Promise<void> {
    this.logger.log(`Service: Updating role for user ${userIdx} to ${updateUserRoleDto.role}`);
    try {
      await this.adminRepository.updateUserRole(userIdx, updateUserRoleDto.role);
    } catch (error) {
      this.logger.error(`Failed to update role for user ${userIdx}`, error.stack);
      if (error.message === 'Role not found') {
        throw new NotFoundException(`Role '${updateUserRoleDto.role}' not found.`);
      }
      throw error;
    }
  }

  async deleteUser(userIdx: number): Promise<void> {
    const affectedRows = await this.adminRepository.deleteUser(userIdx);
    if (affectedRows === 0) {
      throw new NotFoundException(`User with ID ${userIdx} not found.`);
    }
  }

  async changePasswordByAdmin(userIdx: number, adminChangePasswordDto: AdminChangePasswordDto): Promise<void> {
    const { newPassword } = adminChangePasswordDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const affectedRows = await this.adminRepository.updatePassword(userIdx, hashedPassword);
    if (affectedRows === 0) {
      throw new NotFoundException(`User with ID ${userIdx} not found.`);
    }
  }
}
