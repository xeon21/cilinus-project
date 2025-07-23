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
  }

  handleDisconnect(client: Socket) {
    this.connectionCount--;
    const clientId = client.id;
    this.logger.log(
      `Client disconnected: ${clientId} (Total: ${this.connectionCount})`,
    );

    this.eslDeviceService.handleDeviceDisconnect(clientId);
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
      this.logger.debug(
        `Heartbeat acknowledged for device ${heartbeatData.deviceId}`,
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
}
