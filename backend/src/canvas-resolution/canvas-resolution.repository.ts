// backend/src/canvas-resolution/canvas-resolution.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import { CreateCanvasResolutionDto } from '../dto/canvas-resolution.dto';

@Injectable()
export class CanvasResolutionRepository {
  constructor(private readonly db: MysqlProvider) {}

  async create(dto: CreateCanvasResolutionDto) {
    const { name, width, height } = dto;
    const query = 'INSERT INTO canvas_resolutions (name, width, height) VALUES (?, ?, ?)';
    const result = await this.db.executeQuery<any>(query, [name, width, height]);
    return { id: result.insertId, ...dto };
  }

  async findAll() {
    console.log
    const query = 'SELECT * FROM canvas_resolutions ORDER BY id ASC';
     console.log(query);
    return this.db.executeQuery(query);
  }

  async remove(id: number) {
    const query = 'DELETE FROM canvas_resolutions WHERE id = ?';
    return this.db.executeQuery(query, [id]);
  }
}