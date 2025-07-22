import { Controller, Get, UseGuards, Param, Logger } from '@nestjs/common';
import { TagStatusService } from './tag-status.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagStatusData } from '../dto/tag-status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Tag Status')
@Controller('tag-status')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagStatusController {
  private readonly logger = new Logger(TagStatusController.name);
  constructor(private readonly tagStatusService: TagStatusService) {}

  @Get()
  @ApiOperation({
    summary: '매장별 태그 상태 조회',
    description: '모든 매장의 태그 상태 요약 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그 상태 조회 성공',
    type: [TagStatusData],
    isArray: true,
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 유효하지 않은 토큰' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async getTagStatusByStore(): Promise<TagStatusData[]> {
    this.logger.log('Fetching tag status for all stores');
    const result = await this.tagStatusService.getTagStatusByStore();
    this.logger.log(`Retrieved tag status for ${result.length} stores`);
    return result;
  }

  @Get('detail/:storeCode')
  @ApiOperation({
    summary: '특정 매장 태그 상세 조회',
    description:
      '매장 코드를 사용하여 특정 매장의 태그 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'storeCode',
    type: 'string',
    description: '매장 코드',
    example: 'S0011',
  })
  @ApiResponse({
    status: 200,
    description: '태그 상세 정보 조회 성공',
    schema: {
      example: {
        storeCode: 'S0011',
        storeName: '강남점',
        tags: [
          {
            tagId: 'T001',
            itemName: '사과',
            currentPrice: 3000,
            lastUpdated: '2024-01-20T10:30:00Z',
            status: 'active',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패 - 유효하지 않은 토큰' })
  @ApiResponse({ status: 404, description: '매장을 찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async getTagDetailByStoreCode(@Param('storeCode') storeCode: string) {
    this.logger.log(`Fetching tag details for store: ${storeCode}`);
    const result =
      await this.tagStatusService.getTagDetailByStoreCode(storeCode);
    this.logger.log(`Retrieved tag details for store: ${storeCode}`);
    return result;
  }
}
