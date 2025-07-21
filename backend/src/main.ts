import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser'; // [추가] body-parser 임포트

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });
  
  // [추가] 요청 데이터 크기 제한을 늘립니다.
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors();
  
  //Swagger 설정 시작
  const config = new DocumentBuilder()
    .setTitle('ForeFore API') // API 문서의 제목
    .setDescription('ForeFore API description') // API에 대한 설명
    .setVersion('1.0') // API 버전
    .addTag('Auth') // 인증 관련 API
    .addTag('Login') // 로그인 관련 API
    .addTag('UserInfo') // 사용자 정보 관련 API
    .addTag('Admin') // 관리자 기능 API
    .addTag('Game') // 게임 관련 API
    .addTag('Project') // 프로젝트 관련 API
    .addTag('Canvas Resolutions') // 캔버스 해상도 관리 API
    .addTag('Resource') // 리소스 모니터링 API
    .addTag('Tag Status') // 태그 상태 관리 API
    .addBearerAuth() // JWT 인증 활성화
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, { // 'api-docs'는 Swagger UI가 제공될 경로
    swaggerOptions: {
      persistAuthorization: true, // 브라우저 새로고침 시에도 인증 정보 유지 (Bearer Auth 사용 시 유용)
    },
  });
  //Swagger 설정 끝

  app.getHttpAdapter().getInstance().keepAliveTimeout = 15000; 
  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at ${await app.getUrl()}/api-docs`); // Swagger UI 주소 로그
}
bootstrap();
  