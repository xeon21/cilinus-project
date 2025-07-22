// backend/src/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class AuthRepository {
  // 클래스 이름 변경
  constructor(private readonly db: MysqlProvider) {}

  // 로그인 시 사용자 정보를 찾는 메소드
  async findUserByEmail(email: string): Promise<any> {
    const query =
      'SELECT id, email, password_hash, user_name, role_name, organization_id, is_active, last_login FROM users WHERE email = ? AND is_active = true';
    const fullQuery = query.replace('?', `'${email}'`);
    console.log('Executing query:', fullQuery);

    const rows = await this.db.executeQuery<any[]>(query, [email]);

    if (!rows || rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return {
      id: user.id,
      email: user.email,
      password: user.password_hash,
      userName: user.user_name,
      roleName: user.role_name,
      organizationId: user.organization_id,
      isActive: user.is_active,
      lastLogin: user.last_login,
    };
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const query = `
      SELECT DISTINCT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = ?
      UNION
      SELECT DISTINCT p.name
      FROM user_permissions up
      JOIN permissions p ON up.permission_id = p.id
      WHERE up.user_id = ?
    `;
    const rows = await this.db.executeQuery<any[]>(query, [userId, userId]);
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map((row) => row.name);
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const query = `
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `;
    const fullQuery = query.replace('?', userId.toString());
    console.log('Executing query:', fullQuery);

    const rows = await this.db.executeQuery<any[]>(query, [userId]);
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map((row) => row.name);
  }

  // last_login 업데이트 메소드
  async updateLastLogin(userId: number): Promise<void> {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    const fullQuery = query.replace('?', userId.toString());
    console.log('Executing query:', fullQuery);

    await this.db.executeQuery(query, [userId]);
  }
}
