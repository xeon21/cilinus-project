import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EslDeviceGateway } from './esl-device.gateway';
import { EslDeviceService } from './esl-device.service';
import { EslDeviceController } from './esl-device.controller';
import { EslDeviceRepository } from './esl-device.repository';
import { EmailModule } from '../email/email.module';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  imports: [ScheduleModule.forRoot(), EmailModule],
  controllers: [EslDeviceController],
  providers: [
    EslDeviceGateway,
    EslDeviceService,
    EslDeviceRepository,
    MysqlProvider,
  ],
  exports: [EslDeviceService],
})
export class EslDeviceModule {}
