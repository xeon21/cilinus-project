import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger('authController');

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '사용자 로그인',
    description:
      '아이디와 비밀번호를 사용하여 로그인하고 JWT 토큰을 발급받습니다.',
  })
  @ApiBody({
    description: '로그인 정보',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'superadmin@cjfreshway.com',
          description: '사용자 이메일',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: '사용자 비밀번호',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'superadmin@cjfreshway.com',
          userName: '시스템관리자',
          roleName: 'super_admin',
          organizationId: 1,
          roles: ['super_admin'],
          permissions: [
            'organization.create',
            'organization.read',
            'organization.update',
            'organization.delete',
          ],
          lastLogin: '2025-01-22T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 - 잘못된 아이디 또는 비밀번호',
  })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async login(@Body() loginDto: any) {
    this.logger.log(
      'Login attempt: ' + JSON.stringify({ email: loginDto.email }),
    );
    this.logger.log(
      'Request body: ' +
        JSON.stringify({ email: loginDto.email, password: '[REDACTED]' }),
    );

    try {
      const result = await this.authService.login(loginDto);
      this.logger.log('Login successful for user: ' + loginDto.email);
      this.logger.log(
        'Response: ' +
          JSON.stringify({
            accessToken: '[REDACTED]',
            user: {
              id: result.user?.id,
              email: result.user?.email,
              userName: result.user?.userName,
              roleName: result.user?.roleName,
              organizationId: result.user?.organizationId,
              roles: result.user?.roles,
              permissions: `[${result.user?.permissions?.length || 0} permissions]`,
              lastLogin: result.user?.lastLogin,
            },
          }),
      );
      return result;
    } catch (error) {
      this.logger.error(
        'Login failed for user: ' +
          loginDto.email +
          ', Error: ' +
          error.message,
      );
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: '현재 로그인한 사용자의 프로필 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    schema: {
      example: {
        id: 1,
        userId: 1,
        email: 'superadmin@cjfreshway.com',
        userName: '시스템관리자',
        roleName: 'super_admin',
        organizationId: 1,
        roles: ['super_admin'],
        permissions: [
          'organization.create',
          'organization.read',
          'organization.update',
          'organization.delete',
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 유효하지 않은 토큰' })
  getProfile(@Request() req) {
    this.logger.log('Profile requested for user: ' + req.user.email);
    this.logger.log('Response: ' + JSON.stringify(req.user));
    return req.user;
  }
}
