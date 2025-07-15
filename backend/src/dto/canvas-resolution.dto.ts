// backend/src/dto/canvas-resolution.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCanvasResolutionDto {
  @ApiProperty({ description: '해상도 이름 (예: 1920x1080)', example: '1920x1080' })
  name: string;

  @ApiProperty({ description: '너비 (px)', example: 1920 })
  width: number;

  @ApiProperty({ description: '높이 (px)', example: 1080 })
  height: number;
}