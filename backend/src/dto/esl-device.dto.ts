import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HeartbeatDto {
  @ApiProperty({ description: 'ESL 디바이스 ID' })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({ description: '타임스탬프', required: false })
  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @ApiProperty({ description: '디바이스 상태', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '추가 데이터', required: false })
  @IsOptional()
  data?: any;
}

export interface DeviceInfo {
  deviceId: string;
  socketId: string;
  lastHeartbeat: Date;
  isAlive: boolean;
  connectedAt: Date;
  metadata?: any;
}

export interface DeviceStatus {
  deviceId: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
  uptime?: number;
}