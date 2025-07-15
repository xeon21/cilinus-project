// backend/src/canvas-resolution/canvas-resolution.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CanvasResolutionService } from './canvas-resolution.service';
import { CreateCanvasResolutionDto } from '../dto/canvas-resolution.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Canvas Resolutions')
@Controller('canvas-resolutions')
export class CanvasResolutionController {
  constructor(private readonly service: CanvasResolutionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 캔버스 해상도 추가' })
  create(@Body() dto: CreateCanvasResolutionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '모든 캔버스 해상도 목록 조회' })
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '캔버스 해상도 삭제' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}