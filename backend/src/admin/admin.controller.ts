import { Controller, Get, UseGuards, Patch, Param, Body, ParseIntPipe, Delete, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserRoleDto } from '../dto/user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AdminChangePasswordDto } from '../dto/admin-change-password.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    await this.adminService.createUser(registerUserDto);
    return { message: 'User registered successfully' };
  }

  @Get('users')
  @Roles('admin')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:userIdx/role')
  @Roles('admin')
  async updateUserRole(
    @Param('userIdx', ParseIntPipe) userIdx: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    this.logger.log(`Attempting to update role for userIdx: ${userIdx}`);
    this.logger.log(`Payload: ${JSON.stringify(updateUserRoleDto)}`);
    return this.adminService.updateUserRole(userIdx, updateUserRoleDto);
  }

  @Patch('users/:userIdx/password')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async changePasswordByAdmin(
    @Param('userIdx', ParseIntPipe) userIdx: number,
    @Body() adminChangePasswordDto: AdminChangePasswordDto,
  ) {
    await this.adminService.changePasswordByAdmin(userIdx, adminChangePasswordDto);
    return { message: 'Password updated successfully' };
  }

  @Delete('users/:userIdx')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('userIdx', ParseIntPipe) userIdx: number) {
    await this.adminService.deleteUser(userIdx);
    return { message: 'User deleted successfully' };
  }
}
