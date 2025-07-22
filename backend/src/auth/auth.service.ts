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
    this.logger.log(
      `JWT_SECRET: ${jwtSecret ? '[SET - ' + jwtSecret.substring(0, 10) + '...]' : '[NOT SET]'}`,
    );
    this.logger.log(`JWT_EXPIRES_IN: ${jwtExpiresIn || '[NOT SET]'}`);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      this.logger.log(`User not found with email: ${email}`);
      return null;
    }

    this.logger.log(
      `Stored password hash: ${user.password?.substring(0, 20)}...`,
    );

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    this.logger.log(`Password validation result: ${isPasswordValid}`);

    if (user && isPasswordValid) {
      const permissions = await this.authRepository.getUserPermissions(user.id);
      const roles = await this.authRepository.getUserRoles(user.id);

      this.logger.log(`User ${email} has roles: ${JSON.stringify(roles)}`);
      this.logger.log(`User ${email} has role_name: ${user.roleName}`);
      this.logger.log(`User ${email} has ${permissions.length} permissions`);

      // last_login 업데이트
      await this.authRepository.updateLastLogin(user.id);
      this.logger.log(`Updated last_login for user: ${email}`);

      const { password, ...result } = user;
      return {
        ...result,
        roles: roles.length > 0 ? roles : [user.roleName], // role_name을 기본값으로 사용
        permissions,
      };
    }
    return null;
  }

  async login(user: any) {
    this.logger.log(`Login attempt for email: ${user.email}`);
    const validatedUser = await this.validateUser(user.email, user.password);

    if (!validatedUser) {
      this.logger.error(`Login failed for email: ${user.email}`);
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = {
      email: validatedUser.email,
      sub: validatedUser.id,
      userName: validatedUser.userName,
      roleName: validatedUser.roleName,
      organizationId: validatedUser.organizationId,
      roles: validatedUser.roles,
      permissions: validatedUser.permissions,
    };

    this.logger.log(`Generating JWT token for user: ${validatedUser.email}`);
    this.logger.log(
      `User payload: ${JSON.stringify({ ...payload, permissions: `[${payload.permissions.length} permissions]` })}`,
    );

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: validatedUser.id,
        email: validatedUser.email,
        userName: validatedUser.userName,
        roleName: validatedUser.roleName,
        organizationId: validatedUser.organizationId,
        roles: validatedUser.roles,
        permissions: validatedUser.permissions,
        lastLogin: validatedUser.lastLogin,
      },
    };
  }
}
