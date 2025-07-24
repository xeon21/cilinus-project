// 생성: backend/src/resource/resource.module.ts

import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ResourceRepository } from './resource.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository, MysqlProvider],
})
export class ResourceModule {}
