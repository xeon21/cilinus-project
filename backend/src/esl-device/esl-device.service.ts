import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeviceInfo, DeviceStatus } from '../dto/esl-device.dto';
import { EmailService } from '../email/email.service';
import { EslDeviceRepository } from './esl-device.repository';

@Injectable()
export class EslDeviceService {
  private logger = new Logger('EslDeviceService');
  private devices: Map<string, DeviceInfo> = new Map();
  private server: Server;
  private readonly HEARTBEAT_TIMEOUT_MS = 180000; // 3분
  private readonly WARNING_TIMEOUT_MS = 120000; // 2분
  private readonly MAX_RETRY_COUNT = 3; // 최대 재시도 횟수
  private readonly HEARTBEAT_BATCH_INTERVAL_MS = 5000; // 5초마다 배치 처리
  private readonly HEARTBEAT_MIN_UPDATE_INTERVAL_MS = 30000; // 최소 DB 업데이트 간격 30초
  private heartbeatFailureCount: Map<string, number> = new Map(); // 연속 실패 횟수 추적
  private heartbeatBatch: Map<string, Date> = new Map(); // 배치 처리를 위한 heartbeat 저장
  private lastDbUpdate: Map<string, Date> = new Map(); // 마지막 DB 업데이트 시간 추적

  constructor(
    private readonly emailService: EmailService,
    private readonly eslDeviceRepository: EslDeviceRepository,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async registerDevice(
    deviceId: string,
    socketId: string,
    metadata?: any,
  ): Promise<boolean> {
    try {
      const deviceInfo: DeviceInfo = {
        deviceId,
        socketId,
        lastHeartbeat: new Date(),
        isAlive: true,
        connectedAt: new Date(),
        metadata,
        version: 1, // 초기 버전
      };

      this.devices.set(deviceId, deviceInfo);
      this.heartbeatFailureCount.set(deviceId, 0); // 실패 카운트 초기화

      this.logger.log(
        `Device registered - DeviceId: ${deviceId}, SocketId: ${socketId}`,
      );
      this.logger.debug(`Total registered devices: ${this.devices.size}`);

      // DB에서 device 상태를 'active'로 업데이트
      const dbUpdated = await this.eslDeviceRepository.updateDeviceStatus(
        deviceId,
        'active',
      );

      if (dbUpdated) {
        this.logger.log(
          `Database updated - DeviceId: ${deviceId} status set to 'active'`,
        );
      } else {
        this.logger.warn(
          `Failed to update database status for DeviceId: ${deviceId}`,
        );
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to register device ${deviceId}: ${error.message}`,
      );
      return false;
    }
  }

  async unregisterDevice(deviceId: string): Promise<boolean> {
    try {
      const device = this.devices.get(deviceId);
      if (device) {
        this.devices.delete(deviceId);
        this.heartbeatFailureCount.delete(deviceId); // 실패 카운트 제거
        this.logger.log(`Device unregistered - DeviceId: ${deviceId}`);
        this.logger.debug(`Total registered devices: ${this.devices.size}`);

        // DB에서 device 상태를 'inactive'로 업데이트
        const dbUpdated = await this.eslDeviceRepository.updateDeviceStatus(
          deviceId,
          'inactive',
        );

        if (dbUpdated) {
          this.logger.log(
            `Database updated - DeviceId: ${deviceId} status set to 'inactive' on unregister`,
          );
        }

        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to unregister device ${deviceId}: ${error.message}`,
      );
      return false;
    }
  }

  async updateHeartbeat(deviceId: string, socketId: string): Promise<boolean> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        this.logger.warn(
          `Heartbeat update failed - Device not found: ${deviceId}`,
        );
        return false;
      }

      if (device.socketId !== socketId) {
        this.logger.warn(
          `Heartbeat update failed - Socket mismatch for device ${deviceId}. Expected: ${device.socketId}, Got: ${socketId}`,
        );
        return false;
      }

      // 새로운 객체를 생성하여 Map을 업데이트 (버전 증가로 동시성 제어)
      const updatedDevice: DeviceInfo = {
        ...device,
        lastHeartbeat: new Date(),
        isAlive: true,
        version: (device.version || 0) + 1,
      };

      this.devices.set(deviceId, updatedDevice);

      // heartbeat 성공 시 실패 카운트 리셋
      this.heartbeatFailureCount.set(deviceId, 0);

      // 정상 heartbeat는 debug 레벨로만 로깅
      this.logger.debug(
        `Heartbeat updated - DeviceId: ${deviceId}, Time: ${updatedDevice.lastHeartbeat.toISOString()}, SocketId: ${socketId}`,
      );

      // 배치 처리를 위해 메모리에 저장 (즉시 DB 업데이트하지 않음)
      this.heartbeatBatch.set(deviceId, updatedDevice.lastHeartbeat);
      
      // 마지막 DB 업데이트로부터 일정 시간 이상 지났을 때만 즉시 업데이트 (중요한 경우)
      const lastUpdate = this.lastDbUpdate.get(deviceId);
      const now = new Date();
      if (!lastUpdate || now.getTime() - lastUpdate.getTime() > this.HEARTBEAT_MIN_UPDATE_INTERVAL_MS) {
        await this.eslDeviceRepository.updateDeviceHeartbeat(deviceId);
        this.lastDbUpdate.set(deviceId, now);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to update heartbeat for device ${deviceId}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async handleDeviceDisconnect(socketId: string): Promise<void> {
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

          this.logger.warn(
            `Device disconnected - DeviceId: ${disconnectedDeviceId}, SocketId: ${socketId}`,
          );

          // DB에서 device 상태를 'inactive'로 업데이트
          const dbUpdated = await this.eslDeviceRepository.updateDeviceStatus(
            disconnectedDeviceId,
            'inactive',
          );

          if (dbUpdated) {
            this.logger.log(
              `Database updated - DeviceId: ${disconnectedDeviceId} status set to 'inactive'`,
            );
          }

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
    const timeSinceLastHeartbeat =
      now.getTime() - device.lastHeartbeat.getTime();

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

  @Cron('*/5 * * * * *') // 5\ucd08\ub9c8\ub2e4 \uc2e4\ud589
  async flushHeartbeatBatch() {
    if (this.heartbeatBatch.size === 0) {
      return;
    }

    const batchSize = this.heartbeatBatch.size;
    const updates = Array.from(this.heartbeatBatch.entries());
    this.heartbeatBatch.clear();

    this.logger.log(
      `Flushing heartbeat batch: ${batchSize} devices to update`,
    );

    // \ubaa8\ub4e0 deviceId \ucd94\ucd9c
    const deviceIds = updates.map(([deviceId]) => deviceId);
    
    // \ub9c8\uc9c0\ub9c9 DB \uc5c5\ub370\uc774\ud2b8 \uc2dc\uac04 \uae30\ub85d
    const now = new Date();
    deviceIds.forEach(deviceId => {
      this.lastDbUpdate.set(deviceId, now);
    });

    try {
      // \ud55c \ubc88\uc758 \ucffc\ub9ac\ub85c \ubaa8\ub4e0 \ub514\ubc14\uc774\uc2a4 \uc5c5\ub370\uc774\ud2b8
      const affectedRows = await this.eslDeviceRepository.updateHeartbeatsBatch(deviceIds);
      
      this.logger.log(
        `Heartbeat batch flush completed: ${affectedRows}/${batchSize} devices updated`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to flush heartbeat batch: ${error.message}`,
      );
      
      // \uc2e4\ud328 \uc2dc \uac1c\ubcc4 \uc5c5\ub370\uc774\ud2b8\ub85c \ud3f4\ubc31
      for (const [deviceId] of updates) {
        await this.eslDeviceRepository
          .updateDeviceHeartbeat(deviceId)
          .catch((err) => {
            this.logger.error(
              `Failed to update heartbeat for device ${deviceId}: ${err.message}`,
            );
          });
      }
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  checkHeartbeats() {
    const now = new Date();
    this.logger.debug(`Running heartbeat check at ${now.toISOString()}`);

    // 모든 디바이스 상태 로깅
    this.logger.debug(`Total devices in map: ${this.devices.size}`);

    let hasFailures = false;

    this.devices.forEach((device, deviceId) => {
      const timeSinceLastHeartbeat =
        now.getTime() - device.lastHeartbeat.getTime();

      this.logger.debug(
        `Device ${deviceId} - Last heartbeat: ${device.lastHeartbeat.toISOString()}, Time since: ${timeSinceLastHeartbeat}ms, IsAlive: ${device.isAlive}, Threshold: ${this.HEARTBEAT_TIMEOUT_MS}ms`,
      );

      if (device.isAlive) {
        if (timeSinceLastHeartbeat > this.HEARTBEAT_TIMEOUT_MS) {
          // 연속 실패 횟수 증가
          const currentFailureCount =
            (this.heartbeatFailureCount.get(deviceId) || 0) + 1;
          this.heartbeatFailureCount.set(deviceId, currentFailureCount);

          if (currentFailureCount >= this.MAX_RETRY_COUNT) {
            // 최대 재시도 횟수 초과 시 장애 처리
            const updatedDevice: DeviceInfo = {
              ...device,
              isAlive: false,
              version: (device.version || 0) + 1,
            };
            this.devices.set(deviceId, updatedDevice);

            this.logger.error(
              `Device timeout detected - DeviceId: ${deviceId}, Last heartbeat: ${device.lastHeartbeat.toISOString()}, Time since: ${timeSinceLastHeartbeat}ms, Consecutive failures: ${currentFailureCount}`,
            );

            // DB에서 device 상태를 'error'로 업데이트
            this.eslDeviceRepository
              .updateDeviceStatus(deviceId, 'error')
              .then((dbUpdated) => {
                if (dbUpdated) {
                  this.logger.log(
                    `Database updated - DeviceId: ${deviceId} status set to 'error' due to timeout`,
                  );
                }
              })
              .catch((error) => {
                this.logger.error(
                  `Failed to update database status for DeviceId ${deviceId}: ${error.message}`,
                );
              });

            this.handleDeviceFailure(deviceId, 'timeout');
            hasFailures = true;
          } else {
            // 재시도 대기
            this.logger.warn(
              `Device heartbeat delayed - DeviceId: ${deviceId}, Time since: ${timeSinceLastHeartbeat}ms, Failure count: ${currentFailureCount}/${this.MAX_RETRY_COUNT}`,
            );
            hasFailures = true;
          }
        } else if (timeSinceLastHeartbeat > this.WARNING_TIMEOUT_MS) {
          // 경고 상태
          this.logger.warn(
            `Device heartbeat warning - DeviceId: ${deviceId}, Time since: ${timeSinceLastHeartbeat}ms`,
          );
        }
      }
    });

    // 정상 상태일 때는 debug 레벨로만 로깅
    if (!hasFailures) {
      this.logger.debug(
        `Heartbeat check completed. Active devices: ${Array.from(this.devices.values()).filter((d) => d.isAlive).length}/${this.devices.size}`,
      );
    } else {
      this.logger.log(
        `Heartbeat check completed with issues. Active devices: ${Array.from(this.devices.values()).filter((d) => d.isAlive).length}/${this.devices.size}`,
      );
    }
  }

  private async handleDeviceFailure(
    deviceId: string,
    reason: 'timeout' | 'disconnected',
  ) {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        return;
      }

      const failureTime = new Date();
      const lastSeen = device.lastHeartbeat;
      const downtime = failureTime.getTime() - lastSeen.getTime();

      this.logger.error(
        `Device failure - DeviceId: ${deviceId}, Reason: ${reason}, Downtime: ${downtime}ms`,
      );

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
      this.logger.error(
        `Failed to handle device failure for ${deviceId}: ${error.message}`,
      );
    }
  }

  /**
   * 모든 클라이언트에게 시스템 메시지 브로드캐스트
   */
  broadcastSystemMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ) {
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

    this.logger.log(
      `Broadcasting system message: ${message} (level: ${level})`,
    );

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

    const storeDevices = Array.from(this.devices.entries()).filter(
      ([_, device]) => device.metadata?.storeId === storeId,
    );

    this.logger.log(
      `Broadcasting to store ${storeId}: ${storeDevices.length} devices`,
    );

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
  broadcastDeviceStatusChange(
    deviceId: string,
    oldStatus: string,
    newStatus: string,
  ) {
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

    this.logger.log(
      `Broadcasting device status change: ${deviceId} ${oldStatus} -> ${newStatus}`,
    );

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

    this.logger.log(
      `Broadcasting bulk update: ${updates.length} items in ${totalChunks} chunks`,
    );

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
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  /**
   * 긴급 알림 브로드캐스트 (volatile - 오프라인 클라이언트 무시)
   */
  broadcastEmergencyAlert(alert: {
    title: string;
    message: string;
    severity: 'high' | 'critical';
  }) {
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
