import { Controller, Post, Body, Get, UseGuards, Request, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger("authController");
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '사용자 로그인', 
    description: '아이디와 비밀번호를 사용하여 로그인하고 JWT 토큰을 발급받습니다.' 
  })
  @ApiBody({
    description: '로그인 정보',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'admin', description: '사용자 아이디' },
        password: { type: 'string', example: 'password123', description: '사용자 비밀번호' }
      },
      required: ['userId', 'password']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          userId: 'admin',
          userName: '관리자',
          roles: ['admin']
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 잘못된 아이디 또는 비밀번호' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async login(@Body() loginDto: any) {
    this.logger.log('Login attempt: ' + JSON.stringify({ userId: loginDto.userId }));
    const result = await this.authService.login(loginDto);
    this.logger.log('Login successful for user: ' + loginDto.userId);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '사용자 프로필 조회', 
    description: '현재 로그인한 사용자의 프로필 정보를 조회합니다.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 조회 성공',
    schema: {
      example: {
        userId: 'admin',
        userName: '관리자',
        roles: ['admin']
      }
    }
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 유효하지 않은 토큰' })
  getProfile(@Request() req) {
    this.logger.log('Profile requested for user: ' + req.user.userId);
    return req.user;
  }
}