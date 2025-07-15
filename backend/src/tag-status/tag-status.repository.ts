// backend/src/tag-status.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import { TagStatusData, TagDetailData } from '../dto/tag-status.dto';

@Injectable()
export class TagStatusRepository {
  constructor(private readonly db: MysqlProvider) {}

  async getTagStatusByStore(): Promise<TagStatusData[]> {
    // GetTotalStoreTag 저장 프로시저 호출
    const query = `CALL GetTotalStoreTag()`;
    const results = await this.db.executeQuery<any>(query);
    // MySQL 저장 프로시저 결과는 [rows, metadata] 형태로 반환됨
    return results[0] as TagStatusData[];
  }

  async getTagDetailByStoreCode(storeCode: string): Promise<TagDetailData[]> {
    const query = `
      SELECT 
        t.id,
        t.prCode,
        t.tagType,
        t.gwIp,
        t.operation,
        t.status,
        t.version,
        t.rssi,
        t.battery,
        t.temperature,
        t.transmissionTime,
        t.receivingTime,
        t.storeCode
      FROM tags t
      WHERE t.storeCode = ?
      ORDER BY t.receivingTime DESC
    `;
    const results = await this.db.executeQuery<TagDetailData[]>(query, [storeCode]);
    return results;
  }
}
