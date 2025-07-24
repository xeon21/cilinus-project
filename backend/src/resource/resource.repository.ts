import { Injectable, Logger } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class ResourceRepository {
  private logger = new Logger('ResourceRepository');

  constructor(private mysqlProvider: MysqlProvider) {}

  async getDeviceStatusStatistics(): Promise<any[]> {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM esl_devices
        GROUP BY status
      `;

      this.logger.log(`Executing query: ${query}`);

      const result = await this.mysqlProvider.executeQuery(query, []) as any[];

      this.logger.log(`Device status statistics query result: ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to get device status statistics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getTotalDeviceCount(): Promise<number> {
    try {
      const query = `SELECT COUNT(*) as total FROM esl_devices`;

      this.logger.log(`Executing query: ${query}`);

      const result: any[] = await this.mysqlProvider.executeQuery(query, []);

      if (result.length > 0) {
        const total = result[0].total;
        this.logger.log(`Total device count: ${total}`);
        return total;
      }

      return 0;
    } catch (error) {
      this.logger.error(
        `Failed to get total device count: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}