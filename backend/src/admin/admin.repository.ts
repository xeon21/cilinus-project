import { Injectable, Logger } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import { UserDto } from '../dto/user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AdminRepository {
  private readonly logger = new Logger(AdminRepository.name);

  constructor(private readonly db: MysqlProvider) {}

  async findByUserId(userId: string): Promise<any> {
    const query = 'SELECT * FROM user_info WHERE UserID = ?';
    const [user] = await this.db.executeQuery<any[]>(query, [userId]);
    return user;
  }

  async createUser(dto: RegisterUserDto, hashedPassword: string): Promise<void> {
    await this.db.executeTransaction(async (connection) => {
      // 1. Insert user into user_info
      const insertUserQuery = 'INSERT INTO user_info (UserID, UserName, UserPass, regTime) VALUES (?, ?, ?,NOW())';
      const userResult: any = await connection.query(insertUserQuery, [dto.userId, dto.userName, hashedPassword]);
      const newUserIdx = userResult[0].insertId;

      // 2. Get roleId from roles table
      const getRoleQuery = 'SELECT id FROM roles WHERE name = ?';
      const [roles]: any = await connection.query(getRoleQuery, [dto.role]);
      if (roles.length === 0) {
        // This will cause the transaction to rollback
        throw new Error(`Role '${dto.role}' not found`);
      }
      const roleId = roles[0].id;

      // 3. Insert into user_roles
      const insertUserRoleQuery = 'INSERT INTO user_roles (userId, roleId) VALUES (?, ?)';
      await connection.query(insertUserRoleQuery, [newUserIdx, roleId]);
    });
  }

  async getUsers(): Promise<UserDto[]> {
    const query = `
      SELECT
        u.UserIdx,
        u.UserName,
        u.UserID,
        u.RegTime,
        GROUP_CONCAT(r.name SEPARATOR ',') as roles
      FROM user_info u
      LEFT JOIN user_roles ur ON u.UserIdx = ur.userId
      LEFT JOIN roles r ON ur.roleId = r.id
      GROUP BY u.UserIdx
      ORDER BY u.UserIdx DESC
    `;
    const users = await this.db.executeQuery<any[]>(query);
    return users.map(user => ({
      userIdx: user.UserIdx,
      userName: user.UserName,
      userId: user.UserID,
      regTime: user.RegTime,
      roles: user.roles ? user.roles.split(',') : [],
    }));
  }

  async updateUserRole(userIdx: number, role: string): Promise<void> {
    this.logger.log(`Repository: Starting role update for user ${userIdx} to role ${role}`);
    
    await this.db.executeTransaction(async (connection) => {
      this.logger.log('Transaction started.');
      try {
        const deleteResult: any = await connection.query('DELETE FROM user_roles WHERE userId = ?', [userIdx]);
        this.logger.log(`Deleted ${deleteResult[0].affectedRows} existing role(s) for user ${userIdx}.`);

        const [roles]: any[] = await connection.query('SELECT id FROM roles WHERE name = ?', [role]);
        if (roles.length === 0) {
          this.logger.warn(`Role '${role}' not found in database.`);
          throw new Error('Role not found');
        }
        const roleId = roles[0].id;
        this.logger.log(`Found roleId: ${roleId} for role name: ${role}.`);

        await connection.query('INSERT INTO user_roles (userId, roleId) VALUES (?, ?)', [userIdx, roleId]);
        this.logger.log(`Inserted new role mapping: (userId: ${userIdx}, roleId: ${roleId}).`);
      } catch (error) { {
          this.logger.error('Error during transaction, rolling back.', error.stack);
          // re-throw to trigger rollback
          throw error;
        }
      }
    });
    this.logger.log('Transaction completed successfully.');
  }

  async deleteUser(userIdx: number): Promise<number> {
    const query = 'DELETE FROM user_info WHERE UserIdx = ?';
    const result = await this.db.executeQuery<any>(query, [userIdx]);
    return result.affectedRows;
  }

  async updatePassword(userIdx: number, hashedPassword: string): Promise<number> {
    const query = 'UPDATE user_info SET UserPass = ? WHERE UserIdx = ?';
    const result = await this.db.executeQuery<any>(query, [hashedPassword, userIdx]);
    return result.affectedRows;
  }
}