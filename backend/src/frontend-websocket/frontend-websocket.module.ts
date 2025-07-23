import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.modules';
import { FrontendWebSocketGateway } from './frontend-websocket.gateway';
import { EslDeviceModule } from '../esl-device/esl-device.module';

@Module({
  imports: [
    AuthModule, // AuthModule에서 JwtModule을 가져옴
    forwardRef(() => EslDeviceModule), // 순환 의존성 해결
  ],
  providers: [FrontendWebSocketGateway],
  exports: [FrontendWebSocketGateway],
})
export class FrontendWebSocketModule {}
