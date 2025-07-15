// backend/src/dto/project.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: '프로젝트 이름' })
  name: string;

  @ApiProperty({ description: '씬(Scene) 데이터 전체를 포함하는 JSON 객체' })
  data: any;
}

export class UpdateProjectDto {
    @ApiProperty({ description: '프로젝트 이름 (선택 사항)' })
    name?: string;

    @ApiProperty({ description: '씬(Scene) 데이터 전체를 포함하는 JSON 객체 (선택 사항)' })
    data?: any;
}