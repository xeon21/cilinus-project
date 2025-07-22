import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  Param,
} from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { DeviceStatusDto, DeviceDetailDto, PriceTagDetailDto } from 'src/dto/device-status.dto';

@ApiTags('device-status')
@Controller('device-status')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeviceStatusController {
  private readonly logger = new Logger(DeviceStatusController.name);

  constructor(private readonly deviceStatusService: DeviceStatusService) {}

  @Get()
  @ApiOperation({ summary: 'Get all devices status' })
  @ApiResponse({
    status: 200,
    description: 'Return all devices status',
    type: [DeviceStatusDto],
  })
  @ApiQuery({
    name: 'storeCode',
    required: false,
    description: 'Filter by store code',
  })
  @ApiQuery({
    name: 'deviceType',
    required: false,
    description: 'Filter by device type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  async getDeviceStatus(
    @Query('storeCode') storeCode?: string,
    @Query('deviceType') deviceType?: string,
    @Query('status') status?: string,
  ): Promise<DeviceStatusDto[]> {
    this.logger.log(
      `Getting device status with filters - storeCode: ${storeCode}, deviceType: ${deviceType}, status: ${status}`,
    );

    const result = await this.deviceStatusService.getDeviceStatus(
      storeCode,
      deviceType,
      status,
    );

    this.logger.log(`Retrieved ${result.length} device records`);
    this.logger.debug(`Response data: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('detail/:deviceId')
  @ApiOperation({ summary: 'Get device detail by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return device detail',
    type: DeviceDetailDto,
  })
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  async getDeviceDetail(
    @Param('deviceId') deviceId: string,
  ): Promise<DeviceDetailDto> {
    this.logger.log(`Getting device detail for deviceId: ${deviceId}`);

    const result = await this.deviceStatusService.getDeviceDetail(deviceId);

    this.logger.debug(`Device detail response: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('price-tag/:deviceId')
  @ApiOperation({ summary: 'Get price tag details by device ID' })
  @ApiResponse({
    status: 200,
    description: 'Return price tag details for the device',
    type: [PriceTagDetailDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Price tag details not found (deprecated - now returns empty array)',
  })
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  async getPriceTagDetail(
    @Param('deviceId') deviceId: string,
  ): Promise<PriceTagDetailDto[]> {
    this.logger.log(`Getting price tag detail for deviceId: ${deviceId}`);
    this.logger.debug(`Request - deviceId: ${deviceId}`);

    const result = await this.deviceStatusService.getPriceTagDetail(deviceId);

    this.logger.log(`Successfully retrieved price tag detail for deviceId: ${deviceId}`);
    this.logger.debug(`Response - price tag detail: ${JSON.stringify(result)}`);

    return result;
  }
}

