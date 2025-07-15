import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginRepository } from './login.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [LoginController],
  providers: [LoginService, LoginRepository, MysqlProvider],
})
export class LoginModule {}