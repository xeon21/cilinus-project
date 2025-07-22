import { Injectable, Logger } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class DeviceStatusRepository {
  private readonly logger = new Logger(DeviceStatusRepository.name);

  constructor(private readonly db: MysqlProvider) {}

  async findAllDevices(
    storeCode?: string,
    deviceType?: string,
    status?: string,
  ): Promise<any[]> {
    try {
      let query = `
        SELECT 
          ed.id as device_id,
          ed.mac_address,
          ed.device_type,
          o.name as store_name,
          ed.status,
          ed.last_heartbeat as last_update,
          ed.signal_strength,
          ed.firmware_version,
          ed.created_at as install_date,
          ed.updated_at as last_maintenance_date,
          CONCAT(ed.location_aisle, '-', ed.location_shelf) as location,
          '192.168.1.100' as ip_address
        FROM esl_devices ed
        LEFT JOIN organizations o ON ed.organization_id = o.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (storeCode) {
        query += ' AND ed.location_store = ?';
        params.push(storeCode);
      }

      if (deviceType) {
        query += ' AND ed.device_type = ?';
        params.push(deviceType);
      }

      if (status) {
        query += ' AND ed.status = ?';
        params.push(status);
      }

      query += ' ORDER BY ed.last_heartbeat DESC';

      const finalQuery = this.buildQueryWithParams(query, params);
      this.logger.log(`Executing query: ${finalQuery}`);

      const rows = await this.db.executeQuery<any[]>(query, params);

      this.logger.log(`Query returned ${rows.length} rows`);
      return rows;
    } catch (error) {
      this.logger.error(`Error in findAllDevices: ${error.message}`);
      throw error;
    }
  }

  async findDeviceById(deviceId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          ed.id as device_id,
          ed.mac_address,
          ed.device_type,
          o.name as store_name,
          ed.status,
          ed.last_heartbeat as last_update,
          ed.signal_strength,
          ed.firmware_version,
          ed.created_at as install_date,
          ed.updated_at as last_maintenance_date,
          CONCAT(ed.location_aisle, '-', ed.location_shelf) as location,
          '192.168.1.100' as ip_address
        FROM esl_devices ed
        LEFT JOIN organizations o ON ed.organization_id = o.id
        WHERE ed.id = ?
      `;

      const params = [deviceId];
      const finalQuery = this.buildQueryWithParams(query, params);
      this.logger.log(`Executing query: ${finalQuery}`);

      const rows = await this.db.executeQuery<any[]>(query, params);
      const result = rows[0];

      if (result) {
        this.logger.log(`Found device with ID: ${deviceId}`);
      } else {
        this.logger.warn(`No device found with ID: ${deviceId}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in findDeviceById: ${error.message}`);
      throw error;
    }
  }

  async findPriceTagDetailByDeviceId(deviceId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          pt.device_id,
          p.name as product_name,
          p.description as product_description,
          p.current_price,
          p.original_price,
          p.is_promotion,
          p.promotion_end_date,
          tt.name as tag_name,
          tt.category as tag_category
        FROM price_tags pt
        LEFT JOIN products p ON pt.product_id = p.id
        LEFT JOIN tag_templates tt ON pt.tag_template_id = tt.id
        WHERE pt.device_id = ?
        ORDER BY pt.last_updated DESC
      `;

      const params = [deviceId];
      const finalQuery = this.buildQueryWithParams(query, params);
      this.logger.log(`Executing price tag detail query: ${finalQuery}`);

      const rows = await this.db.executeQuery<any[]>(query, params);

      if (rows && rows.length > 0) {
        this.logger.log(`Found ${rows.length} price tag details for device ID: ${deviceId}`);
        this.logger.debug(`Price tag details data: ${JSON.stringify(rows)}`);
      } else {
        this.logger.warn(`No price tag details found for device ID: ${deviceId}`);
      }

      return rows;
    } catch (error) {
      this.logger.error(`Error in findPriceTagDetailByDeviceId: ${error.message}`);
      throw error;
    }
  }

  private buildQueryWithParams(query: string, params: any[]): string {
    let finalQuery = query;
    params.forEach((param) => {
      finalQuery = finalQuery.replace(
        '?',
        typeof param === 'string' ? `'${param}'` : param,
      );
    });
    return finalQuery;
  }
}

