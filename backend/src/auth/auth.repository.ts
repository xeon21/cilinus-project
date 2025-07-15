// backend/src/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class AuthRepository { // 클래스 이름 변경
  constructor(private readonly db: MysqlProvider) {}

  // 로그인 시 사용자 정보를 찾는 메소드
  async findUserByUsername(username: string): Promise<any> {
    const query = 'SELECT UserIdx,UserName, UserID, UserPass FROM user_info WHERE UserID = ?';
    const rows = await this.db.executeQuery<any[]>(query, [username]);

    if (!rows || rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return {
        userId: user.UserIdx,
        username: user.UserName,
        password: user.UserPass, // 평문 비밀번호
    };
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const query = `
      SELECT DISTINCT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.roleId = rp.roleId
      JOIN permissions p ON rp.permissionId = p.id
      WHERE ur.userId = ?
    `;
    const rows = await this.db.executeQuery<any[]>(query, [userId]);
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map(row => row.name);
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const query = `
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON ur.roleId = r.id
      WHERE ur.userId = ?
    `;
    const rows = await this.db.executeQuery<any[]>(query, [userId]);
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map(row => row.name);
  }
}