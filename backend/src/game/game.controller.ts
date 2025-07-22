import {
  RequestDto_CombineRandomTree,
  RequestDto_CombineFomulaTree,
  RequestDto_PlantTree,
  RequestDto_FinalMap,
  RequestDto_PlantNursury,
  RequestDto_SwapGold,
} from '../dto/request.dto'; // DTO 임포트
import {
  ResponseDto_CombineTree,
  ResponseDto_FinalMapInfo,
  ResponseDto_SwapGold,
  ResponseDto_TreeInfomation,
} from '../dto/response.dto'; // 응답 DTO 임포트
import {
  Controller,
  Param,
  Body,
  Get,
  Put,
  Post,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { GameService } from '../game/game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as ClientDto from '../dto/client_dto';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'; //Swagger 데코레이터 추가

@ApiTags('Game')
@ApiBearerAuth()
@Controller('Game')
@UseGuards(JwtAuthGuard)
export class GameController {
  private readonly logger = new Logger('GameController');
  constructor(private GameService: GameService) {}
  //GET Protocol

  @Get('getServerStatus/:itemIndex')
  @ApiOperation({
    summary: '서버 상태 조회',
    description: '특정 인덱스에 해당하는 서버 상태 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'itemIndex',
    type: 'number',
    description: '조회할 아이템 인덱스',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '서버 상태 조회 성공',
    schema: {
      example: {
        data: [
          { serverName: '이마트', regeion: '수원', serverStatus: '1' },
          { serverName: '월마트', regeion: '서울', serverStatus: '0' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getServerStatus(@Param('itemIndex') itemIndex: number) {
    this.logger.log(`[GET] getServerStatus - itemIndex: ${itemIndex}`);
    this.logger.debug(
      `Request received for server status with itemIndex: ${itemIndex}`,
    );

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
    const response = { data: mockServerData };
    this.logger.debug(
      `[GET] getServerStatus - Response: ${JSON.stringify(response)}`,
    );
    return response;
  }

  @Get('getUserStatistics/:itemIndex')
  @ApiOperation({
    summary: '사용자 통계 조회',
    description: '특정 인덱스에 해당하는 사용자 통계 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'itemIndex',
    type: 'number',
    description: '조회할 아이템 인덱스',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 통계 조회 성공',
    schema: {
      example: {
        data: [
          { locationName: '수원', Amount: '30' },
          { locationName: '서울', Amount: '50' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getUserStatistics(@Param('itemIndex') itemIndex: number) {
    this.logger.log(`[GET] getUserStatistics - itemIndex: ${itemIndex}`);
    this.logger.debug(
      `Request received for user statistics with itemIndex: ${itemIndex}`,
    );

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
    const response = { data: mockServerData };
    this.logger.debug(
      `[GET] getUserStatistics - Response: ${JSON.stringify(response)}`,
    );
    return response;
  }
}
