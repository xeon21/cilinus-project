import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.modules';
import { LoginModule } from './login/login.modules';
import { UserInfoModule } from './userinfo/userinfo.modules';
import { AuthModule } from './auth/auth.modules';
import { ProjectModule } from './project/project.module';
import { CanvasResolutionModule } from './canvas-resolution/canvas-resolution.module'; // [추가]
import { AdminModule } from './admin/admin.module'; // [추가]

import { ScheduleModule } from '@nestjs/schedule'; // [추가]
import { ResourceModule } from './resource/resource.module'; // [추가]
import { TagStatusModule } from './tag-status/tag-status.module';
import { TagStatusController } from './tag-status/tag-status.controller';
import { TagStatusService } from './tag-status/tag-status.service';

@Module({

  //imports: [
    //몽고디비 연결
    // MongooseModule.forRoot(
    //   'mongodb+srv://neosdh:aRdA69dCvgYnbEZ8@cluster0.hig4t.mongodb.net/blog',
    // ),
    // MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema}]),

  //],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 사용할 수 있게 함
      envFilePath: '.env', // 기본값도 .env
    }),
    GameModule,
    LoginModule,
    UserInfoModule,
    AuthModule,
    ProjectModule,
    CanvasResolutionModule,
    ScheduleModule.forRoot(), // [추가] 스케줄 모듈 활성화
    ResourceModule, // [추가] 새로 만들 리소스 모듈
    AdminModule, 
    TagStatusModule, // [수정] TagStatusModule만 남김
  ],

  controllers: [], // [수정] TagStatusController 제거

  providers: [], // [수정] TagStatusService 제거
   
})

export class AppModule {}

