// backend/src/project/project.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '새 프로젝트 생성',
    description: '인증된 사용자가 새로운 프로젝트를 생성합니다.',
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: '프로젝트가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자입니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.userId;
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: '모든 프로젝트 목록 조회 (검색 및 페이지네이션)',
    description:
      '프로젝트 목록을 조회합니다. 작성자, 날짜 범위로 필터링 및 페이지네이션이 가능합니다.',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: '프로젝트 작성자로 필터링',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: '시작일 (YYYY-MM-DD 형식)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '종료일 (YYYY-MM-DD 형식)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수 (기본값: 10)',
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 목록을 성공적으로 조회했습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 쿼리 파라미터입니다.' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('author') author?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // [수정] 서비스 호출 시 pagination 인자를 함께 전달합니다.
    return this.projectService.findAll(
      { author, startDate, endDate },
      { page, limit },
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 프로젝트 상세 조회',
    description: 'ID로 특정 프로젝트의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', type: 'number', description: '프로젝트 ID' })
  @ApiResponse({
    status: 200,
    description: '프로젝트 정보를 성공적으로 조회했습니다.',
  })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '특정 프로젝트 업데이트',
    description: '인증된 사용자가 특정 프로젝트의 정보를 업데이트합니다.',
  })
  @ApiParam({ name: 'id', type: 'number', description: '프로젝트 ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: '프로젝트가 성공적으로 업데이트되었습니다.',
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자입니다.' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '특정 프로젝트 삭제',
    description: '인증된 사용자가 특정 프로젝트를 삭제합니다.',
  })
  @ApiParam({ name: 'id', type: 'number', description: '프로젝트 ID' })
  @ApiResponse({
    status: 200,
    description: '프로젝트가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자입니다.' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
