import { Injectable, Logger } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class EslDeviceRepository {
  private logger = new Logger('EslDeviceRepository');

  constructor(private mysqlProvider: MysqlProvider) {}

  async updateDeviceStatus(deviceId: string, status: string): Promise<boolean> {
    try {
      const query = `UPDATE esl_devices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const params = [status, deviceId];

      const completedQuery = query.replace(/\?/g, (match, offset) => {
        const index = query.substring(0, offset).split('?').length - 1;
        const value = params[index];
        return typeof value === 'string' ? `'${value}'` : value;
      });

      this.logger.log(`Executing query: ${completedQuery}`);
      this.logger.log(
        `Update device status - DeviceId: ${deviceId}, Status: ${status}`,
      );

      const result: any = await this.mysqlProvider.executeQuery(query, params);

      if (result.affectedRows > 0) {
        this.logger.log(
          `Successfully updated device status for DeviceId: ${deviceId}`,
        );
        return true;
      } else {
        this.logger.warn(`No device found with DeviceId: ${deviceId}`);
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Failed to update device status for DeviceId ${deviceId}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async updateDeviceHeartbeat(deviceId: string): Promise<boolean> {
    try {
      const query = `UPDATE esl_devices SET last_heartbeat = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const params = [deviceId];

      const completedQuery = query.replace(/\?/g, (match, offset) => {
        const index = query.substring(0, offset).split('?').length - 1;
        const value = params[index];
        return typeof value === 'string' ? `'${value}'` : value;
      });

      this.logger.log(`Executing query: ${completedQuery}`);

      const result: any = await this.mysqlProvider.executeQuery(query, params);

      if (result.affectedRows > 0) {
        this.logger.debug(
          `Successfully updated heartbeat for DeviceId: ${deviceId}`,
        );
        return true;
      } else {
        this.logger.warn(
          `No device found with DeviceId: ${deviceId} for heartbeat update`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Failed to update heartbeat for DeviceId ${deviceId}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async updateHeartbeatsBatch(deviceIds: string[]): Promise<number> {
    if (deviceIds.length === 0) {
      return 0;
    }

    try {
      // CASE WHEN\uc744 \uc0ac\uc6a9\ud558\uc5ec \ud55c \ubc88\uc758 \ucffc\ub9ac\ub85c \uc5ec\ub7ec \ub514\ubc14\uc774\uc2a4 \uc5c5\ub370\uc774\ud2b8
      const cases = deviceIds
        .map((id) => `WHEN id = '${id}' THEN CURRENT_TIMESTAMP`)
        .join(' ');
      const ids = deviceIds.map((id) => `'${id}'`).join(',');

      const query = `
        UPDATE esl_devices 
        SET last_heartbeat = CASE ${cases} ELSE last_heartbeat END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${ids})
      `;

      this.logger.log(`Executing batch update for ${deviceIds.length} devices`);
      this.logger.debug(`Batch update query: ${query}`);

      const result: any = await this.mysqlProvider.executeQuery(query, []);

      if (result.affectedRows > 0) {
        this.logger.log(
          `Successfully batch updated ${result.affectedRows} devices`,
        );
        return result.affectedRows;
      } else {
        this.logger.warn(`No devices updated in batch`);
        return 0;
      }
    } catch (error) {
      this.logger.error(
        `Failed to batch update heartbeats: ${error.message}`,
        error.stack,
      );
      return 0;
    }
  }

  async getDeviceById(deviceId: string): Promise<any> {
    try {
      const query = `SELECT * FROM esl_devices WHERE id = ?`;
      const params = [deviceId];

      const completedQuery = query.replace(/\?/g, (match, offset) => {
        const index = query.substring(0, offset).split('?').length - 1;
        const value = params[index];
        return typeof value === 'string' ? `'${value}'` : value;
      });

      this.logger.log(`Executing query: ${completedQuery}`);

      const result: any[] = await this.mysqlProvider.executeQuery(
        query,
        params,
      );

      if (result.length > 0) {
        this.logger.debug(`Found device with DeviceId: ${deviceId}`);
        return result[0];
      } else {
        this.logger.debug(`No device found with DeviceId: ${deviceId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to get device by DeviceId ${deviceId}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
