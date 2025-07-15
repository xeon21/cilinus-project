import { ResponseDto_GuestLogin } from '../dto/response.dto'; // 게스트 로그인 응답 
import { Controller,Param,Body,Delete,Get,Post,Put } from "@nestjs/common";
import { LoginService } from "./login.service";
import {faker} from '@faker-js/faker';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger'; //Swagger 데코레이터 추가

@ApiTags('Login') //이 컨트롤러의 API들을 'Login' 태그로 그룹화 (main.ts에서 addTag와 일치)
@Controller('Login') 
export class LoginController{
    
    constructor(private loginService: LoginService) {}
    //GET Protocol
    @Get('guestLogin/:uuid')
    @ApiOperation({ //이 API 작업에 대한 설명
      summary: '게스트 로그인',
      description: 'UUID를 사용하여 게스트 사용자로 로그인합니다.'
    })
    @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
      name: 'uuid',
      required: true,
      description: '사용자의 고유 식별자 (UUID)',
      example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
    })
    @ApiResponse({ //성공적인 응답에 대한 설명 및 스키마
      status: 200,
      description: '게스트 로그인 성공',
      type: ResponseDto_GuestLogin, //응답 본문의 타입을 DTO로 지정
    })
    @ApiResponse({ status: 400, description: '잘못된 요청 (예: UUID 형식 오류)' })
    @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
    @ApiResponse({ status: 500, description: '서버 내부 오류' })
    async guestLogin(@Param('uuid') uuid: string)
    {
        console.log('Get guestLogin ');
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
       console.log('guestLogin' + fullName);
        const data = this.loginService.guestLogin(uuid,fullName);
        return data;
    }
 
}
