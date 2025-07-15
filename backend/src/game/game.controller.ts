import { RequestDto_CombineRandomTree, RequestDto_CombineFomulaTree,RequestDto_PlantTree,RequestDto_FinalMap,RequestDto_PlantNursury,RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트
import { ResponseDto_CombineTree,ResponseDto_FinalMapInfo,ResponseDto_SwapGold ,ResponseDto_TreeInfomation} from "../dto/response.dto"; // 응답 DTO 임포트
import { Controller,Param,Body,Get,Put,Post,Logger,UseGuards  } from "@nestjs/common";
import { GameService } from "../game/game.service";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as ClientDto from "../dto/client_dto";


import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody
} from '@nestjs/swagger'; //Swagger 데코레이터 추가

@ApiTags('Game')
@Controller('Game')
@UseGuards(JwtAuthGuard) 
export class GameController{
    private readonly logger = new Logger("GameController");
    constructor(private GameService: GameService) {}
    //GET Protocol
    
    @Get('getServerStatus/:itemIndex')
    async getServerStatus(@Param('itemIndex') itemIndex: number)
    {
      console.log(`Server-Status 요청 받음, 파라미터: ${itemIndex}`);

        // 실제로는 데이터베이스에서 조회해야 할 데이터입니다.
        // 여기서는 요청에 따라 예시용 데이터를 생성합니다.
        const mockServerData = [
            { serverName: '이마트', regeion: '수원', serverStatus: '1' },
            { serverName: '월마트', regeion: '서울', serverStatus: '0' },
            { serverName: '이마트', regeion: '인천', serverStatus: '1' },
            { serverName: '코스트코', regeion: '부산', serverStatus: '1' },
            { serverName: '월마트', regeion: '수원', serverStatus: '0' },
            { serverName: '이마트', regeion: '서울', serverStatus: '1' },
            { serverName: '코스트코', regeion: '서울', serverStatus: '0' },
            { serverName: '월마트', regeion: '부산', serverStatus: '1' },
        ];

    // NestJS는 객체나 배열을 반환하면 자동으로 JSON 형태로 변환하여 응답합니다.
    // 프론트엔드에서 result.data로 접근했으므로, { data: ... } 형태로 감싸서 반환합니다.
    return { data: mockServerData };
           
    }


    @Get('getUserStatistics/:itemIndex')
    async getUserStatistics(@Param('itemIndex') itemIndex: number)
    {
      console.log(`Server-Status 요청 받음, 파라미터: ${itemIndex}`);

    // 실제로는 데이터베이스에서 조회해야 할 데이터입니다.
        // 여기서는 요청에 따라 예시용 데이터를 생성합니다.
        const mockServerData = [
            { locationName: '수원', Amount: '30' },
            { locationName: '서울', Amount: '50' },
            { locationName: '부천', Amount: '33' },
            { locationName: '인천', Amount: '60' },
            { locationName: '춘천', Amount: '33' },
            { locationName: '부산', Amount: '2' },
            { locationName: '전주', Amount: '55' },
            { locationName: '대전', Amount: '113' },
        ];

        // NestJS는 객체나 배열을 반환하면 자동으로 JSON 형태로 변환하여 응답합니다.
        // 프론트엔드에서 result.data로 접근했으므로, { data: ... } 형태로 감싸서 반환합니다.
        return { data: mockServerData };
           
    }

}
