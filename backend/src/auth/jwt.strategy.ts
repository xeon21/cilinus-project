import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  // JWT의 payload를 검증한 후, req.user에 저장될 값을 반환합니다.
  async validate(payload: any) {
    return {
      id: payload.sub,
      userId: payload.sub,
      email: payload.email,
      userName: payload.userName,
      roleName: payload.roleName,
      organizationId: payload.organizationId,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}
