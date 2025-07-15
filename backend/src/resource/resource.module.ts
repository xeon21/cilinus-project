// 생성: backend/src/resource/resource.module.ts

import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}