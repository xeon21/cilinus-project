import { Injectable } from '@nestjs/common';
import { TagStatusRepository } from './tag-status.repository';
import { TagStatusData, TagDetailData } from '../dto/tag-status.dto';

@Injectable()
export class TagStatusService {
  constructor(private readonly tagStatusRepository: TagStatusRepository) {}

  async getTagStatusByStore(): Promise<TagStatusData[]> {
    return this.tagStatusRepository.getTagStatusByStore();
  }

  async getTagDetailByStoreCode(storeCode: string): Promise<TagDetailData[]> {
    return this.tagStatusRepository.getTagDetailByStoreCode(storeCode);
  }
}

