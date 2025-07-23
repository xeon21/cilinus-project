/**
 * WebSocket 브로드캐스팅 예제
 *
 * Socket.IO를 사용한 다양한 브로드캐스팅 방법들
 */

import { Server, Socket } from 'socket.io';

export class BroadcastExamples {
  private server: Server;

  /**
   * 1. 모든 연결된 클라이언트에게 전송 (보낸 사람 포함)
   */
  broadcastToAll(eventName: string, data: any) {
    // namespace 내의 모든 클라이언트에게 전송
    this.server.emit(eventName, data);

    // 특정 namespace의 모든 클라이언트에게 전송
    this.server.of('/esl-device').emit(eventName, data);
  }

  /**
   * 2. 보낸 사람을 제외한 모든 클라이언트에게 전송
   */
  broadcastToOthers(socket: Socket, eventName: string, data: any) {
    // 현재 소켓을 제외한 모든 클라이언트에게 전송
    socket.broadcast.emit(eventName, data);

    // 특정 namespace에서 현재 소켓을 제외한 모든 클라이언트에게 전송
    socket.broadcast.to('/esl-device').emit(eventName, data);
  }

  /**
   * 3. 특정 룸(그룹)의 클라이언트들에게만 전송
   */
  broadcastToRoom(roomName: string, eventName: string, data: any) {
    // 특정 룸의 모든 클라이언트에게 전송
    this.server.to(roomName).emit(eventName, data);

    // 여러 룸에 동시에 전송
    this.server.to('room1').to('room2').emit(eventName, data);
  }

  /**
   * 4. 특정 룸에서 보낸 사람을 제외하고 전송
   */
  broadcastToRoomExceptSender(
    socket: Socket,
    roomName: string,
    eventName: string,
    data: any,
  ) {
    socket.to(roomName).emit(eventName, data);
  }

  /**
   * 5. 특정 소켓 ID에게만 전송 (1:1 통신)
   */
  sendToSpecificSocket(socketId: string, eventName: string, data: any) {
    this.server.to(socketId).emit(eventName, data);
  }

  /**
   * 6. 조건에 맞는 클라이언트들에게만 전송
   */
  async broadcastToFiltered(
    filterFn: (socket: Socket) => boolean,
    eventName: string,
    data: any,
  ) {
    const sockets = await this.server.fetchSockets();

    for (const socket of sockets) {
      if (filterFn(socket as any)) {
        this.server.to(socket.id).emit(eventName, data);
      }
    }
  }

  /**
   * 7. 룸 관리 예제
   */
  roomManagement(socket: Socket) {
    // 룸에 참가
    socket.join('store-A');
    socket.join(['store-A', 'premium-devices']);

    // 룸에서 나가기
    socket.leave('store-A');

    // 소켓이 속한 룸 확인
    const rooms = Array.from(socket.rooms);
    console.log('Socket rooms:', rooms);
  }

  /**
   * 8. 실제 사용 예제 - ESL 디바이스 상태 변경 알림
   */
  notifyDeviceStatusChange(
    deviceId: string,
    status: 'online' | 'offline' | 'warning',
  ) {
    const notification = {
      type: 'DEVICE_STATUS_CHANGE',
      deviceId,
      status,
      timestamp: new Date().toISOString(),
    };

    // 모든 관리자에게 알림
    this.server.to('admins').emit('device-status-update', notification);

    // 해당 매장의 관리자에게만 알림
    this.server
      .to(`store-${deviceId.split('-')[1]}`)
      .emit('device-status-update', notification);

    // 모든 클라이언트에게 알림
    this.server.emit('global-status-update', notification);
  }

  /**
   * 9. 대량 데이터 브로드캐스팅 (청크 단위)
   */
  async broadcastLargeData(
    eventName: string,
    largeData: any[],
    chunkSize: number = 100,
  ) {
    const totalChunks = Math.ceil(largeData.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, largeData.length);
      const chunk = largeData.slice(start, end);

      this.server.emit(`${eventName}-chunk`, {
        chunkIndex: i,
        totalChunks,
        data: chunk,
        isLastChunk: i === totalChunks - 1,
      });

      // 과부하 방지를 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  /**
   * 10. 네임스페이스 간 브로드캐스팅
   */
  crossNamespaceBroadcast(eventName: string, data: any) {
    // 모든 네임스페이스에 브로드캐스트
    this.server.of('/').emit(eventName, data);
    this.server.of('/esl-device').emit(eventName, data);
    this.server.of('/admin').emit(eventName, data);
  }
}

/**
 * 실제 구현 예제
 */
export class EslDeviceBroadcastService {
  constructor(private server: Server) {}

  /**
   * 장애 알림 브로드캐스트
   */
  broadcastDeviceFailure(deviceId: string, reason: string) {
    const alert = {
      level: 'critical',
      deviceId,
      reason,
      timestamp: new Date().toISOString(),
      message: `Device ${deviceId} has failed: ${reason}`,
    };

    // 1. 모든 연결된 클라이언트에게 알림
    this.server.emit('device-failure', alert);

    // 2. 관리자 룸에만 상세 정보 전송
    this.server.to('admin-room').emit('device-failure-detail', {
      ...alert,
      diagnostics: {
        lastHeartbeat: new Date(),
        connectionHistory: [],
      },
    });
  }

  /**
   * 시스템 상태 정기 브로드캐스트
   */
  startSystemStatusBroadcast() {
    setInterval(() => {
      const systemStatus = {
        timestamp: new Date().toISOString(),
        totalDevices: 1000,
        onlineDevices: 950,
        offlineDevices: 50,
        systemHealth: 'good',
      };

      // 대시보드 구독자들에게만 전송
      this.server
        .to('dashboard-subscribers')
        .emit('system-status', systemStatus);
    }, 5000); // 5초마다
  }

  /**
   * 선택적 브로드캐스트 (특정 조건의 디바이스만)
   */
  async broadcastToDevicesByLocation(
    location: string,
    eventName: string,
    data: any,
  ) {
    const sockets = await this.server.fetchSockets();

    for (const socket of sockets) {
      // socket.data에 저장된 메타데이터 확인
      if (socket.data.location === location) {
        this.server.to(socket.id).emit(eventName, data);
      }
    }
  }

  /**
   * 긴급 시스템 알림 (모든 네임스페이스)
   */
  broadcastEmergencyAlert(message: string) {
    const emergency = {
      type: 'EMERGENCY',
      message,
      timestamp: new Date().toISOString(),
      action: 'IMMEDIATE_ATTENTION_REQUIRED',
    };

    // 모든 네임스페이스의 모든 클라이언트에게 전송
    this.server.emit('emergency-alert', emergency);
    this.server.of('/esl-device').emit('emergency-alert', emergency);

    // 추가로 volatile 플래그 사용 (오프라인 클라이언트는 무시)
    this.server.volatile.emit('emergency-alert-volatile', emergency);
  }
}
