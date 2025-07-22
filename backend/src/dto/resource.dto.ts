import { ApiProperty } from '@nestjs/swagger';

export class ResourceLogDto {
  @ApiProperty({
    example: '2023-12-12T12:00:00Z',
    description: '리소스 사용량 측정 시간',
  })
  timestamp: string;

  @ApiProperty({
    example: 55.5,
    description: '메모리 사용률 (%)',
  })
  memory: number;

  @ApiProperty({
    example: 47.3,
    description: '디스크 사용률 (%)',
  })
  disk: number;
}

export class ResourceHistoryResponseDto {
  @ApiProperty({
    type: [ResourceLogDto],
    description: '리소스 사용 기록 배열 (최근 12시간)',
    example: [
      {
        timestamp: '2023-12-12T12:00:00Z',
        memory: 55.5,
        disk: 47.3,
      },
      {
        timestamp: '2023-12-12T12:01:00Z',
        memory: 56.2,
        disk: 47.3,
      },
    ],
  })
  data: ResourceLogDto[];
}
