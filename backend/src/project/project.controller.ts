// backend/src/project/project.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 프로젝트 생성' })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.userId;
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '모든 프로젝트 목록 조회 (검색 및 페이지네이션)' })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('author') author?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // [수정] 서비스 호출 시 pagination 인자를 함께 전달합니다.
    return this.projectService.findAll({ author, startDate, endDate }, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 프로젝트 상세 조회' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 프로젝트 업데이트' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 프로젝트 삭제' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}