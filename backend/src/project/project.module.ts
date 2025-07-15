// backend/src/project/project.module.ts
import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, MysqlProvider],
})
export class ProjectModule {}