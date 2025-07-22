import { Controller, Get, Post, Param, Body, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EslDeviceService } from './esl-device.service';
import { DeviceStatus } from '../dto/esl-device.dto';
import { EmailService } from '../email/email.service';

@ApiTags('ESL Device')
@Controller('api/esl-device')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EslDeviceController {
  private logger = new Logger('EslDeviceController');

  constructor(
    private readonly eslDeviceService: EslDeviceService,
    private readonly emailService: EmailService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: '모든 ESL 디바이스 상태 조회' })
  @ApiResponse({
    status: 200,
    description: '디바이스 상태 목록 반환',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          deviceId: { type: 'string', description: '디바이스 ID' },
          status: { type: 'string', enum: ['online', 'offline', 'warning'], description: '디바이스 상태' },
          lastSeen: { type: 'string', format: 'date-time', description: '마지막 확인 시간' },
          uptime: { type: 'number', description: '가동 시간 (밀리초)' },
        },
      },
    },
  })
  getAllDeviceStatuses(): DeviceStatus[] {
    this.logger.log('Getting all device statuses');
    const statuses = this.eslDeviceService.getAllDeviceStatuses();
    this.logger.debug(`Retrieved ${statuses.length} device statuses`);
    return statuses;
  }

  @Get('status/:deviceId')
  @ApiOperation({ summary: '특정 ESL 디바이스 상태 조회' })
  @ApiParam({ name: 'deviceId', description: '조회할 디바이스 ID' })
  @ApiResponse({
    status: 200,
    description: '디바이스 상태 반환',
    schema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: '디바이스 ID' },
        status: { type: 'string', enum: ['online', 'offline', 'warning'], description: '디바이스 상태' },
        lastSeen: { type: 'string', format: 'date-time', description: '마지막 확인 시간' },
        uptime: { type: 'number', description: '가동 시간 (밀리초)' },
      },
    },
  })
  @ApiResponse({ status: 404, description: '디바이스를 찾을 수 없음' })
  getDeviceStatus(@Param('deviceId') deviceId: string): DeviceStatus | null {
    this.logger.log(`Getting device status for: ${deviceId}`);
    const status = this.eslDeviceService.getDeviceStatus(deviceId);
    if (status) {
      this.logger.debug(`Device status: ${JSON.stringify(status)}`);
    } else {
      this.logger.warn(`Device not found: ${deviceId}`);
    }
    return status;
  }

  @Post('test-email')
  @ApiOperation({ summary: '이메일 설정 테스트' })
  @ApiResponse({ status: 200, description: '테스트 이메일 발송 성공' })
  @ApiResponse({ status: 500, description: '이메일 발송 실패' })
  async testEmail(): Promise<{ success: boolean; message: string }> {
    this.logger.log('Testing email configuration');
    const success = await this.emailService.testEmailConfiguration();
    const message = success ? '테스트 이메일이 성공적으로 발송되었습니다.' : '이메일 발송에 실패했습니다. 설정을 확인하세요.';
    this.logger.log(`Email test result: ${message}`);
    return { success, message };
  }

  @Post('broadcast/system-message')
  @ApiOperation({ summary: '시스템 메시지 브로드캐스트' })
  @ApiResponse({ status: 200, description: '메시지 브로드캐스트 성공' })
  broadcastSystemMessage(
    @Body() payload: { message: string; level?: 'info' | 'warning' | 'error' }
  ): { success: boolean; message: string } {
    const { message, level = 'info' } = payload;
    this.logger.log(`Broadcasting system message: ${message} (level: ${level})`);
    this.logger.debug(`Broadcast payload: ${JSON.stringify(payload)}`);
    
    this.eslDeviceService.broadcastSystemMessage(message, level);
    return { success: true, message: '시스템 메시지가 브로드캐스트되었습니다.' };
  }

  @Post('broadcast/store/:storeId')
  @ApiOperation({ summary: '특정 매장 디바이스에 브로드캐스트' })
  @ApiParam({ name: 'storeId', description: '매장 ID' })
  @ApiResponse({ status: 200, description: '매장 브로드캐스트 성공' })
  async broadcastToStore(
    @Param('storeId') storeId: string,
    @Body() payload: { eventName: string; data: any }
  ): Promise<{ success: boolean; message: string }> {
    const { eventName, data } = payload;
    this.logger.log(`Broadcasting to store ${storeId}: ${eventName}`);
    this.logger.debug(`Store broadcast data: ${JSON.stringify(data)}`);
    
    await this.eslDeviceService.broadcastToStore(storeId, eventName, data);
    return { success: true, message: `매장 ${storeId}에 브로드캐스트되었습니다.` };
  }

  @Post('broadcast/emergency')
  @ApiOperation({ summary: '긴급 알림 브로드캐스트' })
  @ApiResponse({ status: 200, description: '긴급 알림 브로드캐스트 성공' })
  broadcastEmergency(
    @Body() alert: { title: string; message: string; severity: 'high' | 'critical' }
  ): { success: boolean; message: string } {
    this.logger.warn(`Broadcasting emergency alert: ${alert.title}`);
    this.logger.debug(`Emergency alert details: ${JSON.stringify(alert)}`);
    
    this.eslDeviceService.broadcastEmergencyAlert(alert);
    return { success: true, message: '긴급 알림이 브로드캐스트되었습니다.' };
  }
}