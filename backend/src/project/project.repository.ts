// backend/src/project/project.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

// 썸네일을 추출하는 헬퍼 함수
function extractThumbnail(data: any): string | null {
  if (!data || !Array.isArray(data.scenes)) {
    return null;
  }
  for (const scene of data.scenes) {
    if (Array.isArray(scene.regions)) {
      for (const region of scene.regions) {
        if (
          region.content &&
          (region.content.type === 'image' || region.content.type === 'video')
        ) {
          // src가 너무 길 수 있으므로, 미리보기용으로 일부만 잘라서 저장할 수도 있습니다.
          // 여기서는 전체를 저장합니다.
          return region.content.src;
        }
      }
    }
  }
  return null;
}

@Injectable()
export class ProjectRepository {
  private readonly logger = new Logger(ProjectRepository.name);

  constructor(private readonly db: MysqlProvider) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<any> {
    const { name, data } = createProjectDto;
    const jsonData = JSON.stringify(data);
    const thumbnail = extractThumbnail(data); // 썸네일 추출
    const query =
      'INSERT INTO projects (name, data, thumbnail, userId) VALUES (?, ?, ?, ?)';

    // 완성된 쿼리 로깅
    const queryWithParams = query.replace(/\?/g, (match, offset) => {
      const params = [name, jsonData, thumbnail, userId];
      const paramIndex = query.substring(0, offset).split('?').length - 1;
      const param = params[paramIndex];
      if (typeof param === 'string') {
        return param.length > 50
          ? `'${param.substring(0, 50)}...'`
          : `'${param}'`;
      }
      return String(param);
    });
    this.logger.log(`Project create query: ${queryWithParams}`);

    const result = await this.db.executeQuery<any>(query, [
      name,
      jsonData,
      thumbnail,
      userId,
    ]);
    return { id: result.insertId, ...createProjectDto };
  }

  async findAll(
    filters: { author?: string; startDate?: string; endDate?: string },
    pagination: { page: number; limit: number },
  ): Promise<any> {
    const { author, startDate, endDate } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: string[] = [];

    if (author) {
      whereClauses.push('u.user_name LIKE ?');
      params.push(`%${author}%`);
    }
    if (startDate) {
      whereClauses.push('p.createdAt >= ?');
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push('p.createdAt <= ?');
      params.push(`${endDate} 23:59:59`);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 데이터 총 개수 조회 쿼리
    const countQuery = `SELECT count(*) as total FROM projects p LEFT JOIN users u ON p.userId = u.id ${whereSql}`;
    // 완성된 쿼리 로깅
    const paramsForLogging = [...params];
    let paramIndex = 0;
    const countQueryWithParams = countQuery.replace(/\?/g, () => {
      const param = paramsForLogging[paramIndex++];
      return typeof param === 'string' ? `'${param}'` : String(param);
    });
    this.logger.log(`Project count query: ${countQueryWithParams}`);

    const totalResult = await this.db.executeQuery<any[]>(countQuery, params);
    const total = totalResult[0].total;

    // 실제 데이터 조회 쿼리 (페이지네이션 적용)
    const dataQuery = `
        SELECT p.id, p.name, p.createdAt, p.updatedAt, p.thumbnail, u.user_name as author 
        FROM projects p
        LEFT JOIN users u ON p.userId = u.id
        ${whereSql}
        ORDER BY p.updatedAt DESC
        LIMIT ? OFFSET ?
    `;
    // 완성된 쿼리 로깅
    const allParams = [...params, limit, offset];
    let dataParamIndex = 0;
    const dataQueryWithParams = dataQuery.replace(/\?/g, () => {
      const param = allParams[dataParamIndex++];
      return typeof param === 'string' ? `'${param}'` : String(param);
    });
    this.logger.log(`Project data query: ${dataQueryWithParams}`);

    const data = await this.db.executeQuery(dataQuery, [
      ...params,
      limit,
      offset,
    ]);

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<any> {
    const query = 'SELECT * FROM projects WHERE id = ?';

    // 완성된 쿼리 로깅
    const queryWithParams = query.replace('?', String(id));
    this.logger.log(`Project findOne query: ${queryWithParams}`);

    const rows = await this.db.executeQuery<any[]>(query, [id]);
    return rows[0];
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<any> {
    const { name, data } = updateProjectDto;

    const fields: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      fields.push('name = ?');
      params.push(name);
    }
    if (data !== undefined) {
      const jsonData = JSON.stringify(data);
      const thumbnail = extractThumbnail(data);
      fields.push('data = ?');
      fields.push('thumbnail = ?');
      params.push(jsonData, thumbnail);
    }

    if (fields.length === 0) {
      return { affectedRows: 0, message: 'No fields to update' };
    }

    params.push(id);
    const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;

    // 완성된 쿼리 로깅
    let paramIndex = 0;
    const queryWithParams = query.replace(/\?/g, () => {
      const param = params[paramIndex++];
      if (typeof param === 'string') {
        return param.length > 50
          ? `'${param.substring(0, 50)}...'`
          : `'${param}'`;
      }
      return String(param);
    });
    this.logger.log(`Project update query: ${queryWithParams}`);

    return this.db.executeQuery(query, params);
  }

  async remove(id: number): Promise<any> {
    const query = 'DELETE FROM projects WHERE id = ?';

    // 완성된 쿼리 로깅
    const queryWithParams = query.replace('?', String(id));
    this.logger.log(`Project remove query: ${queryWithParams}`);

    return this.db.executeQuery(query, [id]);
  }
}
