// 생성: backend/src/resource/resource.controller.ts

import { Controller, Get, Logger } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceLogDto } from '../dto/resource.dto';

@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
  private readonly logger = new Logger(ResourceController.name);

  constructor(private readonly resourceService: ResourceService) {}

  @Get('history')
  @ApiOperation({
    summary: '리소스 사용 기록 조회',
    description:
      '최근 12시간 동안의 시스템 리소스(메모리, 디스크) 사용 기록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리소스 사용 기록 조회 성공',
    type: [ResourceLogDto],
  })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async getHistory() {
    //this.logger.log('GET /resource/history - 리소스 사용 기록 조회 요청');

    const resourceHistory = await this.resourceService.getResourceHistory();

    this.logger.log(
      `리소스 사용 기록 조회 완료 - ${resourceHistory.length}개 항목 반환`,
    );

    return resourceHistory;
  }
}
