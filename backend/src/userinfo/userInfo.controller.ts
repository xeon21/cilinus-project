import { ResponseDto_UserData,ResponseDto_TreeDataAll, ResponseDto_GetMyItem,ResponseDto_GetMyNurseryData } from '../dto/response.dto'; // 게스트 로그인 응답 
import { Controller,Param,Body,Get,Put,Post, Patch, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { UserInfoService } from "./userInfo.service";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger'; //Swagger 데코레이터 추가

@ApiTags('UserInfo')
@Controller('userinfo') 
export class UserInfoController{
    
    constructor(private UserInfoService: UserInfoService) {}

    @Patch('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '비밀번호 변경' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: '비밀번호가 성공적으로 변경되었습니다.' })
    @ApiResponse({ status: 401, description: '인증되지 않았거나 비밀번호가 틀렸습니다.' })
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        // req.user는 JwtAuthGuard를 통해 주입된 JWT payload입니다.
        const userIdx = req.user.sub; 
        await this.UserInfoService.changePassword(userIdx, changePasswordDto);
        return { message: '비밀번호가 성공적으로 변경되었습니다.' };
    }
    
    //사용자 정보 조회 API
    @Get('getUserInfo/:userIndex')
    
        @ApiOperation({ //이 API 작업에 대한 설명
          summary: '사용자 정보 조회 ',
          description: '서버로 부터 받은 인덱스 번호를  사용하여 유저 기본 정보를 서버로 부터 조회합니다. '
        })
        @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
          name: 'userIndex',
          required: true,
          description: '정수형 사용자의 고유 식별자 (userIndex)',
          example: 9,
          type: Number
        })
        @ApiResponse({ //성공적인 응답에 대한 설명 및 스키마
          status: 200,
          description: '유저 정보 데이터 조회 성공',
          type: ResponseDto_UserData, //응답 본문의 타입을 DTO로 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
    
    async getUserInfo(@Param('userIndex') uIndex: number)
    {
        console.log('Get getUserInfo ');
        const data = this.UserInfoService.getUserInfo(uIndex);
        return data;
    }


    //내 나무 정보 조회 API
    @Get('getMyTreeInfo/:userIndex')
        
        @ApiOperation({ 
          summary: '내 나무 정보 조회 ',
          description: '서버로 부터 받은 인덱스 번호를  사용하여 내 나무 정보를 조회합니다다.'
        })
        @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
          name: 'userIndex',
          required: true,
          description: '정수형 사용자의 고유 식별자 (userIndex)',
          example: 9,
          type: Number
        })
        @ApiResponse({ //성공적인 응답에 대한 설명 및 스키마
          status: 200,
          description: '나무 정보 조회 성공',
          type: ResponseDto_TreeDataAll, //응답 본문의 타입을 DTO로 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
    async getMyTreeInfo(@Param('userIndex') uIndex: number)
    {
        console.log('Get getMyTreeInfo ');
        const data = await this.UserInfoService.getMyTreeInfo(uIndex);
        console.log("getMyTreeInfo : "+ data);
        return data;
    }


    //내 묘목 정보 조회 API
    @Get('getMyNursery/:userIndex')
     @ApiOperation({ 
          summary: '내 양묘장 정보 조회 ',
          description: '서버로 부터 받은 인덱스 번호를  사용하여 내 양묘장장 정보를 조회합니다다.'
        })
        @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
          name: 'userIndex',
          required: true,
          description: '정수형 사용자의 고유 식별자 (userIndex)',
          example: 9,
          type: Number
        })
        @ApiResponse({ //성공적인 응답에 대한 설명 및 스키마
          status: 200,
          description: '양묘장 정보 조회 성공',
          type: ResponseDto_GetMyNurseryData, //응답 본문의 타입을 DTO로 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
    async getMyNursury(@Param('userIndex') uIndex: number)
    {
        console.log('Get getMyNursury ');
        //return this.loginService.getAllPosts();
        const data = this.UserInfoService.getMyNusuryInfo(uIndex);
        console.log("getMyNursury : "+data);
        return data;
    }


    //내가 보유한 아이템 정보 조회 API
    @Get('getMyItem/:userIndex')
        @ApiOperation({ 
          summary: '내 아이템 정보조회',
          description: '서버로 부터 받은 인덱스 번호를  사용하여 내 아이템템 정보를 조회합니다.'
        })
        @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
          name: 'userIndex',
          required: true,
          description: '정수형 사용자의 고유 식별자 (userIndex)',
          example: 9,
          type: Number
        })
        @ApiResponse({ //성공적인 응답에 대한 설명 및 스키마
          status: 200,
          description: '아이템 정보 조회 성공',
          type: ResponseDto_GetMyItem, //응답 본문의 타입을 DTO로 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
    async getMyItem(@Param('userIndex') uIndex: number)
    {
        console.log('Get getMyItem ');
       
        const data = this.UserInfoService.getMyItem(uIndex);
        console.log("getMyItem : "+data);
        return data;
    }

    
}
