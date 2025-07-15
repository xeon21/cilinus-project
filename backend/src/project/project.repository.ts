// backend/src/project/project.repository.ts
import { Injectable } from '@nestjs/common';
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
                if (region.content && (region.content.type === 'image' || region.content.type === 'video')) {
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
  constructor(private readonly db: MysqlProvider) {}

  async create(createProjectDto: CreateProjectDto, userId:number): Promise<any> {
    const { name, data } = createProjectDto;
    const jsonData = JSON.stringify(data);
    const thumbnail = extractThumbnail(data); // 썸네일 추출
    const query = 'INSERT INTO projects (name, data, thumbnail, userId) VALUES (?, ?, ?, ?)';
    const result = await this.db.executeQuery<any>(query, [name, jsonData, thumbnail,userId]);
    return { id: result.insertId, ...createProjectDto };
  }

   async findAll(
    filters: { author?: string; startDate?: string; endDate?: string },
    pagination: { page: number; limit: number }
  ): Promise<any> {
    const { author, startDate, endDate } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const whereClauses:string[] = [];
    const params:string[] = [];

    if (author) {
        whereClauses.push('u.username LIKE ?');
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

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 데이터 총 개수 조회 쿼리
    const countQuery = `SELECT count(*) as total FROM projects p LEFT JOIN user_info u ON p.userId = u.UserIdx ${whereSql}`;
    const totalResult = await this.db.executeQuery<any[]>(countQuery, params);
    const total = totalResult[0].total;

    // 실제 데이터 조회 쿼리 (페이지네이션 적용)
    const dataQuery = `
        SELECT p.id, p.name, p.createdAt, p.updatedAt, p.thumbnail, u.username as author 
        FROM projects p
        LEFT JOIN user_info u ON p.userId = u.UserIdx
        ${whereSql}
        ORDER BY p.updatedAt DESC
        LIMIT ? OFFSET ?
    `;
    const data = await this.db.executeQuery(dataQuery, [...params, limit, offset]);

    return {
        data,
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
    };
  }

  async findOne(id: number): Promise<any> {
    const query = 'SELECT * FROM projects WHERE id = ?';
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

    return this.db.executeQuery(query, params);
  }

  async remove(id: number): Promise<any> {
    const query = 'DELETE FROM projects WHERE id = ?';
    return this.db.executeQuery(query, [id]);
  }
}