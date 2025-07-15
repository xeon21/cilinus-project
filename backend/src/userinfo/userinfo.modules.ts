import { Module } from '@nestjs/common';
import { UserInfoController } from './userInfo.controller';
import { UserInfoService } from './userInfo.service';
import { UsersRepository } from './userinfo.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [UserInfoController],
  providers: [UserInfoService, UsersRepository, MysqlProvider],
})
export class UserInfoModule {}
