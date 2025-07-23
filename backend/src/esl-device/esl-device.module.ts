import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EslDeviceGateway } from './esl-device.gateway';
import { EslDeviceService } from './esl-device.service';
import { EslDeviceController } from './esl-device.controller';
import { EslDeviceRepository } from './esl-device.repository';
import { EmailModule } from '../email/email.module';
import { MysqlProvider } from '../database/mysql.provider';
import { FrontendWebSocketModule } from '../frontend-websocket/frontend-websocket.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EmailModule,
    forwardRef(() => FrontendWebSocketModule),
  ],
  controllers: [EslDeviceController],
  providers: [
    EslDeviceGateway,
    EslDeviceService,
    EslDeviceRepository,
    MysqlProvider,
  ],
  exports: [EslDeviceService, EslDeviceGateway],
})
export class EslDeviceModule {}
