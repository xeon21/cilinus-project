import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EslDeviceService } from './esl-device.service';
import { HeartbeatDto } from '../dto/esl-device.dto';

@WebSocketGateway({
  namespace: 'esl-device',
  cors: {
    origin: '*',
  },
  // 성능 최적화 설정
  maxHttpBufferSize: 1e6, // 1MB - 메시지 크기 제한
  pingTimeout: 20000, // 20초 - ping 응답 대기 시간
  pingInterval: 25000, // 25초 - ping 전송 간격
  transports: ['websocket'], // polling 비활성화로 성능 향상
  perMessageDeflate: false, // 압축 비활성화 (CPU 절약)
})
export class EslDeviceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EslDeviceGateway');
  private readonly MAX_CONNECTIONS = 10000; // 최대 연결 수 제한
  private connectionCount = 0;

  constructor(private readonly eslDeviceService: EslDeviceService) {}

  afterInit(server: Server) {
    this.logger.log('ESL Device WebSocket Gateway initialized');
    this.eslDeviceService.setServer(server);

    // Socket.IO 서버 설정
    server.setMaxListeners(this.MAX_CONNECTIONS);
  }

  handleConnection(client: Socket) {
    // 최대 연결 수 체크
    if (this.connectionCount >= this.MAX_CONNECTIONS) {
      this.logger.warn(
        `Connection rejected - Max connections (${this.MAX_CONNECTIONS}) reached`,
      );
      client.emit('error', {
        message: 'Server is at maximum capacity',
        code: 'MAX_CONNECTIONS_REACHED',
      });
      client.disconnect();
      return;
    }

    this.connectionCount++;
    const clientId = client.id;
    const query = client.handshake.query;

    this.logger.log(
      `Client connected: ${clientId} (Total: ${this.connectionCount})`,
    );
    this.logger.debug(`Connection query params: ${JSON.stringify(query)}`);

    client.emit('connected', {
      message: 'Successfully connected to ESL Device WebSocket',
      socketId: clientId,
      serverTime: new Date().toISOString(),
    });

    // 디바이스 연결 시 프론트엔드 웹소켓으로 이벤트 전달
    const deviceId = query.deviceId as string;
    if (deviceId) {
      // client 데이터에 deviceId 저장
      client.data.deviceId = deviceId;
      
      const broadcastData = {
        deviceId,
        socketId: clientId,
        status: 'ready',
        timestamp: new Date().toISOString(),
        eventType: 'device-connected',
      };

      // EslDeviceService를 통해 프론트엔드에 전달
      this.eslDeviceService.notifyFrontend(
        'device-status-changed',
        broadcastData,
      );

      this.logger.log(
        `Device connected event sent to frontend: ${JSON.stringify(broadcastData)}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.connectionCount--;
    const clientId = client.id;
    const query = client.handshake.query;
    // query, client.data, 서비스에서 순차적으로 deviceId 찾기
    const deviceId = (query.deviceId as string) || 
                    client.data.deviceId || 
                    this.eslDeviceService.getDeviceIdBySocketId(clientId);

    this.logger.log(
      `Client disconnected: ${clientId}, DeviceId: ${deviceId || 'N/A'} (Total: ${this.connectionCount})`,
    );

    // handleDeviceDisconnect 호출 - 이 메서드가 디바이스를 찾아서 처리
    this.eslDeviceService.handleDeviceDisconnect(clientId);

    // 디바이스 ID를 찾았다면 프론트엔드에 전달
    if (deviceId) {
      const broadcastData = {
        deviceId: deviceId,
        socketId: clientId,
        status: 'inactive',
        timestamp: new Date().toISOString(),
        eventType: 'device-disconnected',
        reason: 'socket-disconnect',
      };

      this.eslDeviceService.notifyFrontend(
        'device-status-changed',
        broadcastData,
      );

      this.logger.log(
        `Device disconnected event sent to frontend: ${JSON.stringify(broadcastData)}`,
      );
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() data: { deviceId: string; metadata?: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { deviceId, metadata } = data;
    const socketId = client.id;

    this.logger.log(
      `Device registration - DeviceId: ${deviceId}, SocketId: ${socketId}`,
    );
    this.logger.debug(`Registration data: ${JSON.stringify(data)}`);

    const result = await this.eslDeviceService.registerDevice(
      deviceId,
      socketId,
      metadata,
    );

    client.emit('registered', {
      success: result,
      deviceId,
      socketId,
    });

    // 디바이스 등록 시 room에 join
    if (result) {
      // 기존 room에서 나가고 새로운 room에 join (소켓 ID 변경 대비)
      const rooms = Array.from(client.rooms);
      rooms.forEach(room => {
        if (room.startsWith('device:') && room !== `device:${deviceId}`) {
          client.leave(room);
        }
      });
      
      client.join(`device:${deviceId}`);
      // 클라이언트 데이터에 deviceId 저장 (나중에 참조하기 위해)
      client.data.deviceId = deviceId;
      
      this.logger.log(`Device ${deviceId} joined room: device:${deviceId}`);
      
      const broadcastData = {
        deviceId,
        socketId,
        status: 'active',
        timestamp: new Date().toISOString(),
        eventType: 'device-registered',
        metadata,
      };

      this.eslDeviceService.notifyFrontend(
        'device-status-changed',
        broadcastData,
      );

      this.logger.log(
        `Device registered event sent to frontend: ${JSON.stringify(broadcastData)}`,
      );
    }

    return { success: result };
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(
    @MessageBody() heartbeatData: HeartbeatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const socketId = client.id;
    const receiveTime = new Date();

    this.logger.debug(
      `Heartbeat received - DeviceId: ${heartbeatData.deviceId}, SocketId: ${socketId}, Time: ${receiveTime.toISOString()}`,
    );
    this.logger.debug(`Heartbeat data: ${JSON.stringify(heartbeatData)}`);

    const result = await this.eslDeviceService.updateHeartbeat(
      heartbeatData.deviceId,
      socketId,
    );

    if (result) {
      client.emit('heartbeat-ack', {
        received: true,
        timestamp: receiveTime.toISOString(),
        deviceId: heartbeatData.deviceId,
      });

      // 프론트엔드에 디바이스 상태 업데이트 전달
      const broadcastData = {
        deviceId: heartbeatData.deviceId,
        timestamp: receiveTime.toISOString(),
        status: 'online',
        data: heartbeatData.data,
      };

      this.eslDeviceService.notifyFrontend(
        'device-heartbeat-received',
        broadcastData,
      );

      this.logger.log(
        `Heartbeat acknowledged and sent to frontend for device ${heartbeatData.deviceId}. Data: ${JSON.stringify(broadcastData)}`,
      );
    } else {
      this.logger.error(
        `Heartbeat update failed for device ${heartbeatData.deviceId}`,
      );
      client.emit('heartbeat-error', {
        received: false,
        timestamp: receiveTime.toISOString(),
        deviceId: heartbeatData.deviceId,
        error: 'Failed to update heartbeat',
      });
    }

    return { acknowledged: result };
  }

  @SubscribeMessage('unregister')
  async handleUnregister(
    @MessageBody() data: { deviceId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { deviceId } = data;
    const socketId = client.id;

    this.logger.log(
      `Device unregistration - DeviceId: ${deviceId}, SocketId: ${socketId}`,
    );

    const result = await this.eslDeviceService.unregisterDevice(deviceId);

    client.emit('unregistered', {
      success: result,
      deviceId,
    });

    return { success: result };
  }

  @SubscribeMessage('status')
  handleStatus(
    @MessageBody() data: { deviceId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { deviceId } = data;

    if (deviceId) {
      const status = this.eslDeviceService.getDeviceStatus(deviceId);
      return { status };
    } else {
      const allStatuses = this.eslDeviceService.getAllDeviceStatuses();
      return {
        statuses: allStatuses,
        connectionCount: this.connectionCount,
        maxConnections: this.MAX_CONNECTIONS,
      };
    }
  }

  // 현재 연결 수 조회 메서드
  getConnectionCount(): number {
    return this.connectionCount;
  }

  // 최대 연결 수 조회 메서드
  getMaxConnections(): number {
    return this.MAX_CONNECTIONS;
  }

  /**
   * 프론트엔드로부터 브로드캐스트 메시지 수신 처리
   * 프론트엔드 게이트웨이에서 전달된 메시지를 ESL 디바이스가 수신
   */
  @SubscribeMessage('frontend-broadcast')
  handleFrontendBroadcast(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `ESL Device received frontend broadcast - SocketId: ${client.id}, Data: ${JSON.stringify(data)}`,
    );

    // ESL 디바이스는 브로드캐스트를 받기만 하므로 별도 처리 없음
    // 필요시 디바이스에서 추가 처리 가능
    return {
      received: true,
      timestamp: new Date().toISOString(),
    };
  }
}
