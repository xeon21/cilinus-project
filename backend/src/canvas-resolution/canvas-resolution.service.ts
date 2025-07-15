// backend/src/canvas-resolution/canvas-resolution.service.ts
import { Injectable } from '@nestjs/common';
import { CanvasResolutionRepository } from './canvas-resolution.repository';
import { CreateCanvasResolutionDto } from '../dto/canvas-resolution.dto';

@Injectable()
export class CanvasResolutionService {
  constructor(private readonly repository: CanvasResolutionRepository) {}

  create(dto: CreateCanvasResolutionDto) {
    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  remove(id: number) {
    return this.repository.remove(id);
  }
}