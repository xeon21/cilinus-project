// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authRepository.findUserByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const permissions = await this.authRepository.getUserPermissions(user.userId);
      const roles = await this.authRepository.getUserRoles(user.userId); // 역할 정보 가져오기

      const { password, ...result } = user;
      return {
        ...result,
        roles, // 역할 정보 추가
        permissions,
      };
    }
    return null;
  }

  async login(user: any) {
    const validatedUser = await this.validateUser(user.username, user.password);

    if (!validatedUser) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }
    
    const payload = {
      username: validatedUser.username,
      sub: validatedUser.userId,
      roles: validatedUser.roles, // payload에 역할 정보 추가
      permissions: validatedUser.permissions,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
