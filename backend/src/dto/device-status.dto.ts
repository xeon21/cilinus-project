import { ApiProperty } from '@nestjs/swagger';

export class DeviceStatusDto {
  @ApiProperty({ example: 'DEV-001', description: 'Device unique identifier' })
  deviceId: string;

  @ApiProperty({ example: '23inch', description: 'Type of device' })
  deviceType: string;

  @ApiProperty({ example: 'Seoul Store', description: 'Name of the store' })
  storeName: string;

  @ApiProperty({ example: 'active', description: 'Current device status' })
  status: string;

  @ApiProperty({
    example: '2025-01-22T10:30:00Z',
    description: 'Last update timestamp',
  })
  lastUpdate: string;

  @ApiProperty({ example: 92, description: 'Signal strength percentage' })
  signal: number;

  @ApiProperty({
    example: 'AA:BB:CC:DD:EE:FF',
    description: 'Device MAC address',
    required: false,
  })
  macAddress?: string;
}

export class DeviceDetailDto extends DeviceStatusDto {
  @ApiProperty({ example: '2.1.0', description: 'Firmware version' })
  firmwareVersion: string;

  @ApiProperty({
    example: '2024-01-15T09:00:00Z',
    description: 'Installation date',
  })
  installDate: string;

  @ApiProperty({
    example: '2024-12-20T14:00:00Z',
    description: 'Last maintenance date',
  })
  lastMaintenanceDate: string;

  @ApiProperty({
    example: 'Aisle 3, Shelf B',
    description: 'Physical location',
  })
  location: string;

  @ApiProperty({ example: '192.168.1.100', description: 'Device IP address' })
  ipAddress: string;

  @ApiProperty({
    example: 'AA:BB:CC:DD:EE:FF',
    description: 'Device MAC address',
  })
  declare macAddress: string;
}

export class PriceTagDetailDto {
  @ApiProperty({ example: 'DEV-001', description: 'Device unique identifier' })
  deviceId: string;

  @ApiProperty({
    example: 'Premium Coffee Beans',
    description: 'Product name',
    nullable: true,
  })
  productName: string;

  @ApiProperty({
    example: 'High quality arabica coffee beans from Colombia',
    description: 'Product description',
    nullable: true,
  })
  productDescription: string;

  @ApiProperty({ example: 12500, description: 'Current price', nullable: true })
  currentPrice: number;

  @ApiProperty({
    example: 15000,
    description: 'Original price',
    nullable: true,
  })
  originalPrice: number;

  @ApiProperty({ example: true, description: 'Whether promotion is active' })
  isPromotion: boolean;

  @ApiProperty({
    example: '2025-02-15T23:59:59Z',
    description: 'Promotion end date',
    nullable: true,
  })
  promotionEndDate: string | null;

  @ApiProperty({
    example: 'Sale Template',
    description: 'Tag template name',
    nullable: true,
  })
  tagName: string;

  @ApiProperty({
    example: 'Food & Beverage',
    description: 'Tag category',
    nullable: true,
  })
  tagCategory: string;
}
