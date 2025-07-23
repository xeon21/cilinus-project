import { Module } from '@nestjs/common';
import { DeviceStatusController } from './device-status.controller';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusRepository } from './device-status.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [DeviceStatusController],
  providers: [DeviceStatusService, DeviceStatusRepository, MysqlProvider],
  exports: [DeviceStatusService],
})
export class DeviceStatusModule {}
