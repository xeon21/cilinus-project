import { Controller, Post, Body, Get, UseGuards, Request,Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger("authController");
  
  @Post('login')
  async login(@Body() loginDto: any) {
     this.logger.log('login: '+ JSON.stringify(loginDto));
    // 실제로는 DTO(Data Transfer Object)를 만들어 사용하는 것이 좋습니다.
    return this.authService.login(loginDto);
  }

  // 이 라우트는 JWT 인증을 통과해야만 접근할 수 있습니다.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}