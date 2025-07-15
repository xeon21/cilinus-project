import { Injectable,InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { Pool,PoolConnection } from 'mysql2/promise';

@Injectable()
export class MysqlProvider {
  private pool: Pool | null = null;
  private readonly logger = new Logger(MysqlProvider.name);
  constructor(private readonly configService: ConfigService) {}
    
    // 커넥션 풀 생성
  async getPool(): Promise<Pool> {
    this.logger.log('DB_HOST: ' + this.configService.get<string>('DB_USER'));
    this.logger.log('DB_HOST: ' + this.configService.get<string>('DB_HOST'));
    
    if (!this.pool) {
      try {
          this.pool = mysql.createPool({
       
            host: this.configService.get<string>('DB_HOST'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            waitForConnections: true,
            connectionLimit: this.configService.get<number>('DB_CONNECTION_LIMIT') || 10,
       
        });
       
        
      } catch (error) {
         this.logger.error('DB 연결 실패', error.stack);
        throw new InternalServerErrorException('데이터베이스 연결에 실패했습니다.');
      }
      
    }
    
    
    return this.pool;
  }

  // 쿼리 실행 메서드
  async executeQuery<T>(sql: string, params?: any[]): Promise<T> {
    try {
      const pool = await this.getPool();
      const [rows] = await pool.query(sql, params);
      return rows as T;
    } catch (error) {
      this.logger.error('쿼리 실행 중 오류 발생', error.stack);
      throw new InternalServerErrorException('DB 쿼리 오류');
    }
  }

  
  // 트랜잭션 예제
  async executeTransaction<T>(callback: (conn: PoolConnection) => Promise<T>): Promise<T> {
    const pool = await this.getPool();
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}