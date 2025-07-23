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
import { Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EslDeviceService } from '../esl-device/esl-device.service';

@ApiTags('Frontend WebSocket')
@WebSocketGateway({
  namespace: 'frontend',
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class FrontendWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('FrontendWebSocketGateway');
  private frontendClients: Map<string, { userId?: string; socketId: string }> =
    new Map();

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => EslDeviceService))
    private readonly eslDeviceService: EslDeviceService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Frontend WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const clientId = client.id;

    try {
      // JWT 토큰 검증 (옵션)
      const token =
        client.handshake.auth?.token || client.handshake.headers?.authorization;
      let userId: string | undefined;

      if (token) {
        try {
          const payload = this.jwtService.verify(token.replace('Bearer ', ''));
          userId = payload.sub;
          this.logger.log(
            `Authenticated frontend client connected: ${clientId}, UserId: ${userId}`,
          );
        } catch (error) {
          this.logger.warn(
            `Frontend client connected without valid auth: ${clientId}`,
          );
        }
      } else {
        this.logger.log(`Anonymous frontend client connected: ${clientId}`);
      }

      this.frontendClients.set(clientId, { userId, socketId: clientId });

      // 연결 성공 응답
      client.emit('connected', {
        message: 'Successfully connected to Frontend WebSocket',
        socketId: clientId,
        authenticated: !!userId,
        serverTime: new Date().toISOString(),
      });

      this.logger.log(
        `Frontend client connected: ${clientId} (Total: ${this.frontendClients.size})`,
      );
    } catch (error) {
      this.logger.error(`Error handling frontend connection: ${error.message}`);
      client.emit('error', {
        message: 'Connection error',
        error: error.message,
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    const clientInfo = this.frontendClients.get(clientId);

    this.frontendClients.delete(clientId);

    this.logger.log(
      `Frontend client disconnected: ${clientId}, UserId: ${clientInfo?.userId || 'N/A'} (Total: ${this.frontendClients.size})`,
    );
  }

  @SubscribeMessage('subscribe-device-events')
  handleSubscribeDeviceEvents(
    @MessageBody() data: { deviceIds?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { deviceIds } = data || {};

    if (deviceIds && deviceIds.length > 0) {
      // 특정 디바이스 이벤트만 구독
      deviceIds.forEach((deviceId) => {
        client.join(`device:${deviceId}`);
      });

      this.logger.log(
        `Frontend client ${client.id} subscribed to devices: ${deviceIds.join(', ')}`,
      );

      return {
        success: true,
        subscribedDevices: deviceIds,
      };
    } else {
      // 모든 디바이스 이벤트 구독
      client.join('all-devices');

      this.logger.log(
        `Frontend client ${client.id} subscribed to all device events`,
      );

      return {
        success: true,
        subscribedTo: 'all-devices',
      };
    }
  }

  @SubscribeMessage('unsubscribe-device-events')
  handleUnsubscribeDeviceEvents(
    @MessageBody() data: { deviceIds?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { deviceIds } = data || {};

    if (deviceIds && deviceIds.length > 0) {
      deviceIds.forEach((deviceId) => {
        client.leave(`device:${deviceId}`);
      });

      this.logger.log(
        `Frontend client ${client.id} unsubscribed from devices: ${deviceIds.join(', ')}`,
      );
    } else {
      client.leave('all-devices');

      this.logger.log(
        `Frontend client ${client.id} unsubscribed from all device events`,
      );
    }

    return { success: true };
  }

  /**
   * 디바이스 이벤트를 프론트엔드 클라이언트에게 전달
   */
  broadcastDeviceEvent(eventName: string, data: any) {
    const deviceId = data.deviceId;

    // 받은 데이터와 보낸 데이터 로깅 (개발 모드)
    this.logger.log(
      `Broadcasting device event to frontend - Event: ${eventName}, Received data: ${JSON.stringify(data)}`,
    );

    // 특정 디바이스 구독자에게 전송
    if (deviceId) {
      this.server.to(`device:${deviceId}`).emit(eventName, data);

      this.logger.log(
        `Sent to device:${deviceId} subscribers - Event: ${eventName}, Sent data: ${JSON.stringify(data)}`,
      );
    }

    // 모든 디바이스 구독자에게 전송
    this.server.to('all-devices').emit(eventName, data);

    this.logger.log(
      `Sent to all-devices subscribers - Event: ${eventName}, Sent data: ${JSON.stringify(data)}`,
    );
  }

  /**
   * 시스템 메시지를 모든 프론트엔드 클라이언트에게 전송
   */
  broadcastSystemMessage(message: any) {
    this.logger.log(
      `Broadcasting system message to all frontend clients - Received: ${JSON.stringify(message)}`,
    );

    this.server.emit('system-message', message);

    this.logger.log(
      `System message sent to all frontend clients - Sent: ${JSON.stringify(message)}`,
    );
  }

  /**
   * 특정 사용자에게만 메시지 전송
   */
  sendToUser(userId: string, eventName: string, data: any) {
    const userSockets = Array.from(this.frontendClients.entries())
      .filter(([_, client]) => client.userId === userId)
      .map(([socketId]) => socketId);

    if (userSockets.length > 0) {
      this.logger.log(
        `Sending to user ${userId} - Event: ${eventName}, Data: ${JSON.stringify(data)}`,
      );

      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit(eventName, data);
      });

      return true;
    }

    this.logger.warn(`User ${userId} not found in connected clients`);
    return false;
  }

  /**
   * 현재 연결된 프론트엔드 클라이언트 수 조회
   */
  getConnectionCount(): number {
    return this.frontendClients.size;
  }

  /**
   * 인증된 사용자 수 조회
   */
  getAuthenticatedUserCount(): number {
    return Array.from(this.frontendClients.values()).filter(
      (client) => !!client.userId,
    ).length;
  }

  /**
   * 브로드캐스트 메시지 처리 - 프론트엔드에서 받은 메시지를 ESL 디바이스들에게 전달
   */
  @SubscribeMessage('broadcast-message')
  handleBroadcastMessage(
    @MessageBody() data: { message: string; targetDevices?: string[]; sender?: string; timestamp?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const broadcastData = {
      ...data,
      originSocketId: client.id,
      receivedAt: new Date().toISOString(),
    };

    // 받은 데이터 로깅
    this.logger.log(
      `Broadcast message received from frontend - SocketId: ${client.id}, Data: ${JSON.stringify(data)}`,
    );

    // ESL 디바이스 서비스를 통해 브로드캐스트 전송
    if (data.targetDevices && data.targetDevices.length > 0) {
      // 특정 디바이스들에게만 전송
      data.targetDevices.forEach((deviceId) => {
        this.eslDeviceService.sendToDevice(deviceId, 'frontend-broadcast', broadcastData);
        
        this.logger.log(
          `Broadcast sent to device:${deviceId} - Data: ${JSON.stringify(broadcastData)}`,
        );
      });
    } else {
      // 모든 연결된 ESL 디바이스에게 전송
      this.eslDeviceService.broadcastToAll('frontend-broadcast', broadcastData);
      
      this.logger.log(
        `Broadcast sent to all ESL devices - Data: ${JSON.stringify(broadcastData)}`,
      );
    }

    // 응답 반환
    const response = {
      success: true,
      message: 'Broadcast message sent',
      targetDevices: data.targetDevices || 'all',
      timestamp: new Date().toISOString(),
    };

    this.logger.log(
      `Broadcast response sent to frontend - Response: ${JSON.stringify(response)}`,
    );

    return response;
  }
}
