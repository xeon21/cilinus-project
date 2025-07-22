// backend/src/dto/project.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: '프로젝트 이름',
    example: '2025년 신년 프로모션',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '씬(Scene) 데이터 전체를 포함하는 JSON 객체',
    example: {
      scenes: [
        {
          id: 'scene1',
          name: 'Scene 1',
          regions: [],
        },
      ],
      selectedSceneId: 'scene1',
    },
  })
  @IsObject()
  @IsNotEmpty()
  data: any;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: '프로젝트 이름 (선택 사항)',
    example: '2025년 신년 프로모션 수정',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: '씬(Scene) 데이터 전체를 포함하는 JSON 객체 (선택 사항)',
    example: {
      scenes: [
        {
          id: 'scene1',
          name: 'Scene 1 Updated',
          regions: [],
        },
      ],
      selectedSceneId: 'scene1',
    },
  })
  @IsObject()
  @IsOptional()
  data?: any;
}
