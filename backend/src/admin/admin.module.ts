import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { MysqlProvider } from '../database/mysql.provider';
import { AuthModule } from '../auth/auth.modules';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, MysqlProvider],
})
export class AdminModule {}
