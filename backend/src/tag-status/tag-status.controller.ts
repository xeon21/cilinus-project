import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { TagStatusService } from './tag-status.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagStatusData } from '../dto/tag-status.dto';

@Controller('tag-status')
@UseGuards(JwtAuthGuard)
export class TagStatusController {
  constructor(private readonly tagStatusService: TagStatusService) {}

  @Get()
  async getTagStatusByStore(): Promise<TagStatusData[]> {
    return this.tagStatusService.getTagStatusByStore();
  }

  @Get('detail/:storeCode')
  async getTagDetailByStoreCode(@Param('storeCode') storeCode: string) {
    return this.tagStatusService.getTagDetailByStoreCode(storeCode);
  }
}

