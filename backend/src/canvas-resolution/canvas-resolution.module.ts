// backend/src/canvas-resolution/canvas-resolution.module.ts
import { Module } from '@nestjs/common';
import { CanvasResolutionService } from './canvas-resolution.service';
import { CanvasResolutionController } from './canvas-resolution.controller';
import { CanvasResolutionRepository } from './canvas-resolution.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [CanvasResolutionController],
  providers: [CanvasResolutionService, CanvasResolutionRepository, MysqlProvider],
})
export class CanvasResolutionModule {}