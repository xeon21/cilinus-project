import { Controller, Get, UseGuards, Patch, Param, Body, ParseIntPipe, Delete, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserRoleDto } from '../dto/user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AdminChangePasswordDto } from '../dto/admin-change-password.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user', description: 'Admin only endpoint to register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering new user - Request: ${JSON.stringify(registerUserDto)}`);
    await this.adminService.createUser(registerUserDto);
    const response = { message: 'User registered successfully' };
    this.logger.log(`User registered - Response: ${JSON.stringify(response)}`);
    return response;
  }

  @Get('users')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users', description: 'Admin only endpoint to retrieve all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getUsers() {
    this.logger.log('Fetching all users');
    const users = await this.adminService.getUsers();
    this.logger.log(`Users retrieved - Response: ${JSON.stringify(users)}`);
    return users;
  }

  @Patch('users/:userIdx/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user role', description: 'Admin only endpoint to update a user role' })
  @ApiParam({ name: 'userIdx', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserRole(
    @Param('userIdx', ParseIntPipe) userIdx: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    this.logger.log(`Attempting to update role for userIdx: ${userIdx}`);
    this.logger.log(`Request payload: ${JSON.stringify(updateUserRoleDto)}`);
    const result = await this.adminService.updateUserRole(userIdx, updateUserRoleDto);
    this.logger.log(`Role updated - Response: ${JSON.stringify(result)}`);
    return result;
  }

  @Patch('users/:userIdx/password')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password', description: 'Admin only endpoint to change a user password' })
  @ApiParam({ name: 'userIdx', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePasswordByAdmin(
    @Param('userIdx', ParseIntPipe) userIdx: number,
    @Body() adminChangePasswordDto: AdminChangePasswordDto,
  ) {
    this.logger.log(`Changing password for userIdx: ${userIdx}`);
    this.logger.log(`Request payload: ${JSON.stringify({ ...adminChangePasswordDto, newPassword: '[REDACTED]' })}`);
    await this.adminService.changePasswordByAdmin(userIdx, adminChangePasswordDto);
    const response = { message: 'Password updated successfully' };
    this.logger.log(`Password updated - Response: ${JSON.stringify(response)}`);
    return response;
  }

  @Delete('users/:userIdx')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user', description: 'Admin only endpoint to delete a user' })
  @ApiParam({ name: 'userIdx', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('userIdx', ParseIntPipe) userIdx: number) {
    this.logger.log(`Deleting user with userIdx: ${userIdx}`);
    await this.adminService.deleteUser(userIdx);
    const response = { message: 'User deleted successfully' };
    this.logger.log(`User deleted - Response: ${JSON.stringify(response)}`);
    return response;
  }
}
