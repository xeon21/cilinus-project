// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthRepository } from './auth.repository'; // [추가]
import { MysqlProvider } from '../database/mysql.provider'; // [추가]

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  // [수정] 필요한 모든 Provider를 등록합니다.
  providers: [AuthService, JwtStrategy, AuthRepository, MysqlProvider],
})
export class AuthModule {}