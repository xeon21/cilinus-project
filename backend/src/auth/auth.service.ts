// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    
    this.logger.log(`JWT Configuration loaded:`);
    this.logger.log(`JWT_SECRET: ${jwtSecret ? '[SET - ' + jwtSecret.substring(0, 10) + '...]' : '[NOT SET]'}`);
    this.logger.log(`JWT_EXPIRES_IN: ${jwtExpiresIn || '[NOT SET]'}`);
  }

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
