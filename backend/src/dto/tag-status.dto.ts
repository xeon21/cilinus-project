// backend/src/dto/tag-status.dto.ts
export class TagStatusData {
  companyName: string;
  companyCode: string;
  storeName: string;
  storeCode: string;
  total: number;
  ok: number;
  wip: number;
  ng: number;
}

export class TagDetailData {
  id: string;
  prCode: string;
  tagType: string;
  gwIp: string;
  operation: string;
  status: string;
  version: string;
  rssi: number;
  battery: number;
  temperature: number;
  transmissionTime: Date;
  receivingTime: Date;
  storeCode: string;
}
