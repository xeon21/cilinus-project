import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeviceStatusRepository } from './device-status.repository';
import {
  DeviceStatusDto,
  DeviceDetailDto,
  PriceTagDetailDto,
} from 'src/dto/device-status.dto';

@Injectable()
export class DeviceStatusService {
  private readonly logger = new Logger(DeviceStatusService.name);

  constructor(
    private readonly deviceStatusRepository: DeviceStatusRepository,
  ) {}

  async getDeviceStatus(
    storeCode?: string,
    deviceType?: string,
    status?: string,
  ): Promise<DeviceStatusDto[]> {
    try {
      this.logger.log('Fetching device status from repository');

      const devices = await this.deviceStatusRepository.findAllDevices(
        storeCode,
        deviceType,
        status,
      );

      const result = devices.map((device) => ({
        deviceId: device.device_id,
        deviceType: device.device_type,
        storeName: device.store_name,
        status: device.status,
        lastUpdate: device.last_update,
        signal: device.signal_strength,
      }));

      this.logger.log(`Processed ${result.length} device records`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching device status: ${error.message}`);
      throw error;
    }
  }

  async getDeviceDetail(deviceId: string): Promise<DeviceDetailDto> {
    try {
      this.logger.log(`Fetching device detail for ID: ${deviceId}`);

      const device = await this.deviceStatusRepository.findDeviceById(deviceId);

      if (!device) {
        throw new Error(`Device not found with ID: ${deviceId}`);
      }

      const result: DeviceDetailDto = {
        deviceId: device.device_id,
        deviceType: device.device_type,
        storeName: device.store_name,
        status: device.status,
        lastUpdate: device.last_update,
        signal: device.signal_strength,
        firmwareVersion: device.firmware_version,
        installDate: device.install_date,
        lastMaintenanceDate: device.last_maintenance_date,
        location: device.location,
        ipAddress: device.ip_address,
        macAddress: device.mac_address,
      };

      this.logger.log(
        `Successfully retrieved device detail for ID: ${deviceId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error fetching device detail: ${error.message}`);
      throw error;
    }
  }

  async getPriceTagDetail(deviceId: string): Promise<PriceTagDetailDto[]> {
    try {
      this.logger.log(`Fetching price tag detail for device ID: ${deviceId}`);
      this.logger.debug(`Request received - deviceId: ${deviceId}`);

      const priceTagDetails =
        await this.deviceStatusRepository.findPriceTagDetailByDeviceId(
          deviceId,
        );

      if (!priceTagDetails || priceTagDetails.length === 0) {
        this.logger.warn(
          `No price tag details found for device ID: ${deviceId}`,
        );
        return [];
      }

      const results: PriceTagDetailDto[] = priceTagDetails.map(
        (priceTag: any) => ({
          deviceId: priceTag.device_id || '',
          productName: priceTag.product_name || '',
          productDescription: priceTag.product_description || '',
          currentPrice: priceTag.current_price || 0,
          originalPrice: priceTag.original_price || 0,
          isPromotion: priceTag.is_promotion || false,
          promotionEndDate: priceTag.promotion_end_date || null,
          tagName: priceTag.tag_name || '',
          tagCategory: priceTag.tag_category || '',
        }),
      );

      this.logger.log(
        `Successfully retrieved ${results.length} price tag details for device ID: ${deviceId}`,
      );
      this.logger.debug(`Response data: ${JSON.stringify(results)}`);

      return results;
    } catch (error) {
      this.logger.error(`Error fetching price tag detail: ${error.message}`);
      throw error;
    }
  }
}
