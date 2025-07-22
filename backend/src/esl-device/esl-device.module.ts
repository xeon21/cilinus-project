import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EslDeviceGateway } from './esl-device.gateway';
import { EslDeviceService } from './esl-device.service';
import { EslDeviceController } from './esl-device.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), EmailModule],
  controllers: [EslDeviceController],
  providers: [EslDeviceGateway, EslDeviceService],
  exports: [EslDeviceService],
})
export class EslDeviceModule {}