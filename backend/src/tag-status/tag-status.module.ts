import { Module } from '@nestjs/common';
import { TagStatusController } from './tag-status.controller';
import { TagStatusService } from './tag-status.service';
import { TagStatusRepository } from './tag-status.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [TagStatusController],
  providers: [TagStatusService, TagStatusRepository, MysqlProvider],
})
export class TagStatusModule {}
