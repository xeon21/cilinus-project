import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeviceInfo, DeviceStatus } from '../dto/esl-device.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class EslDeviceService {
  private logger = new Logger('EslDeviceService');
  private devices: Map<string, DeviceInfo> = new Map();
  private server: Server;
  private readonly HEARTBEAT_TIMEOUT_MS = 30000; // 30초
  private readonly WARNING_TIMEOUT_MS = 20000; // 20초

  constructor(private readonly emailService: EmailService) {}

  setServer(server: Server) {
    this.server = server;
  }

  registerDevice(deviceId: string, socketId: string, metadata?: any): boolean {
    try {
      const deviceInfo: DeviceInfo = {
        deviceId,
        socketId,
        lastHeartbeat: new Date(),
        isAlive: true,
        connectedAt: new Date(),
        metadata,
      };

      this.devices.set(deviceId, deviceInfo);
      
      this.logger.log(`Device registered - DeviceId: ${deviceId}, SocketId: ${socketId}`);
      this.logger.debug(`Total registered devices: ${this.devices.size}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to register device ${deviceId}: ${error.message}`);
      return false;
    }
  }

  unregisterDevice(deviceId: string): boolean {
    try {
      const device = this.devices.get(deviceId);
      if (device) {
        this.devices.delete(deviceId);
        this.logger.log(`Device unregistered - DeviceId: ${deviceId}`);
        this.logger.debug(`Total registered devices: ${this.devices.size}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to unregister device ${deviceId}: ${error.message}`);
      return false;
    }
  }

  updateHeartbeat(deviceId: string, socketId: string): boolean {
    try {
      const device = this.devices.get(deviceId);
      if (device && device.socketId === socketId) {
        device.lastHeartbeat = new Date();
        device.isAlive = true;
        this.devices.set(deviceId, device);
        
        this.logger.debug(`Heartbeat updated - DeviceId: ${deviceId}, Time: ${device.lastHeartbeat.toISOString()}`);
        return true;
      }
      
      this.logger.warn(`Heartbeat update failed - Device not found or socket mismatch: ${deviceId}`);
      return false;
    } catch (error) {
      this.logger.error(`Failed to update heartbeat for device ${deviceId}: ${error.message}`);
      return false;
    }
  }

  handleDeviceDisconnect(socketId: string): void {
    try {
      let disconnectedDeviceId: string | null = null;
      
      this.devices.forEach((device, deviceId) => {
        if (device.socketId === socketId) {
          disconnectedDeviceId = deviceId;
        }
      });

      if (disconnectedDeviceId) {
        const device = this.devices.get(disconnectedDeviceId);
        if (device) {
          device.isAlive = false;
          this.devices.set(disconnectedDeviceId, device);
          
          this.logger.warn(`Device disconnected - DeviceId: ${disconnectedDeviceId}, SocketId: ${socketId}`);
          
          // 즉시 장애로 판단하고 이메일 발송
          this.handleDeviceFailure(disconnectedDeviceId, 'disconnected');
        }
      }
    } catch (error) {
      this.logger.error(`Error handling device disconnect: ${error.message}`);
    }
  }

  getDeviceStatus(deviceId: string): DeviceStatus | null {
    const device = this.devices.get(deviceId);
    if (!device) {
      return null;
    }

    const now = new Date();
    const timeSinceLastHeartbeat = now.getTime() - device.lastHeartbeat.getTime();
    
    let status: 'online' | 'offline' | 'warning' = 'online';
    if (!device.isAlive || timeSinceLastHeartbeat > this.HEARTBEAT_TIMEOUT_MS) {
      status = 'offline';
    } else if (timeSinceLastHeartbeat > this.WARNING_TIMEOUT_MS) {
      status = 'warning';
    }

    return {
      deviceId: device.deviceId,
      status,
      lastSeen: device.lastHeartbeat,
      uptime: now.getTime() - device.connectedAt.getTime(),
    };
  }

  getAllDeviceStatuses(): DeviceStatus[] {
    const statuses: DeviceStatus[] = [];
    
    this.devices.forEach((device, deviceId) => {
      const status = this.getDeviceStatus(deviceId);
      if (status) {
        statuses.push(status);
      }
    });

    return statuses;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  checkHeartbeats() {
    const now = new Date();
    this.logger.debug(`Running heartbeat check at ${now.toISOString()}`);

    this.devices.forEach((device, deviceId) => {
      const timeSinceLastHeartbeat = now.getTime() - device.lastHeartbeat.getTime();
      
      if (device.isAlive && timeSinceLastHeartbeat > this.HEARTBEAT_TIMEOUT_MS) {
        device.isAlive = false;
        this.devices.set(deviceId, device);
        
        this.logger.error(`Device timeout detected - DeviceId: ${deviceId}, Last heartbeat: ${device.lastHeartbeat.toISOString()}`);
        
        this.handleDeviceFailure(deviceId, 'timeout');
      }
    });

    this.logger.debug(`Heartbeat check completed. Active devices: ${Array.from(this.devices.values()).filter(d => d.isAlive).length}/${this.devices.size}`);
  }

  private async handleDeviceFailure(deviceId: string, reason: 'timeout' | 'disconnected') {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        return;
      }

      const failureTime = new Date();
      const lastSeen = device.lastHeartbeat;
      const downtime = failureTime.getTime() - lastSeen.getTime();

      this.logger.error(`Device failure - DeviceId: ${deviceId}, Reason: ${reason}, Downtime: ${downtime}ms`);

      // 이메일 발송
      await this.emailService.sendDeviceFailureAlert({
        deviceId,
        reason,
        lastSeen,
        failureTime,
        metadata: device.metadata,
      });

      // WebSocket으로 장애 알림 브로드캐스트
      if (this.server) {
        this.server.emit('device-failure', {
          deviceId,
          reason,
          timestamp: failureTime.toISOString(),
        });
      }
    } catch (error) {
      this.logger.error(`Failed to handle device failure for ${deviceId}: ${error.message}`);
    }
  }

  /**
   * 모든 클라이언트에게 시스템 메시지 브로드캐스트
   */
  broadcastSystemMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (!this.server) {
      this.logger.warn('Server not initialized, cannot broadcast');
      return;
    }

    const systemMessage = {
      type: 'SYSTEM_MESSAGE',
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Broadcasting system message: ${message} (level: ${level})`);
    
    // 모든 연결된 클라이언트에게 전송
    this.server.emit('system-message', systemMessage);
  }

  /**
   * 특정 매장의 디바이스들에게만 브로드캐스트
   */
  async broadcastToStore(storeId: string, eventName: string, data: any) {
    if (!this.server) {
      return;
    }

    const storeDevices = Array.from(this.devices.entries())
      .filter(([_, device]) => device.metadata?.storeId === storeId);

    this.logger.log(`Broadcasting to store ${storeId}: ${storeDevices.length} devices`);

    // 해당 매장의 디바이스들에게만 전송
    for (const [deviceId, device] of storeDevices) {
      this.server.to(device.socketId).emit(eventName, {
        ...data,
        targetStore: storeId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 디바이스 상태 변경 브로드캐스트
   */
  broadcastDeviceStatusChange(deviceId: string, oldStatus: string, newStatus: string) {
    if (!this.server) {
      return;
    }

    const statusChange = {
      type: 'DEVICE_STATUS_CHANGE',
      deviceId,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Broadcasting device status change: ${deviceId} ${oldStatus} -> ${newStatus}`);
    
    // 모든 클라이언트에게 상태 변경 알림
    this.server.emit('device-status-changed', statusChange);
  }

  /**
   * 대량 업데이트 알림 (청크 단위)
   */
  async broadcastBulkUpdate(updates: any[], chunkSize: number = 50) {
    if (!this.server) {
      return;
    }

    const totalChunks = Math.ceil(updates.length / chunkSize);
    
    this.logger.log(`Broadcasting bulk update: ${updates.length} items in ${totalChunks} chunks`);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, updates.length);
      const chunk = updates.slice(start, end);

      this.server.emit('bulk-update-chunk', {
        chunkIndex: i,
        totalChunks,
        chunkSize: chunk.length,
        data: chunk,
        isLastChunk: i === totalChunks - 1,
        timestamp: new Date().toISOString(),
      });

      // 과부하 방지를 위한 짧은 딜레이
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  /**
   * 긴급 알림 브로드캐스트 (volatile - 오프라인 클라이언트 무시)
   */
  broadcastEmergencyAlert(alert: { title: string; message: string; severity: 'high' | 'critical' }) {
    if (!this.server) {
      return;
    }

    const emergencyAlert = {
      type: 'EMERGENCY_ALERT',
      ...alert,
      timestamp: new Date().toISOString(),
      id: `ALERT-${Date.now()}`,
    };

    this.logger.error(`Broadcasting emergency alert: ${alert.title}`);
    
    // volatile 플래그로 전송 (현재 연결된 클라이언트에게만)
    this.server.volatile.emit('emergency-alert', emergencyAlert);
  }
}