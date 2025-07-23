import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger = new Logger('WsJwtGuard');

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromClient(client);

      if (!token) {
        throw new WsException('Unauthorized: No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token);

      // 페이로드를 클라이언트 객체에 첨부
      client.data.user = payload;

      return true;
    } catch (error) {
      this.logger.error(`WebSocket authentication failed: ${error.message}`);
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractTokenFromClient(client: Socket): string | undefined {
    // auth 객체에서 토큰 추출
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      return authToken.replace('Bearer ', '');
    }

    // 헤더에서 토큰 추출
    const headerToken = client.handshake.headers?.authorization;
    if (headerToken) {
      return headerToken.replace('Bearer ', '');
    }

    // 쿼리 파라미터에서 토큰 추출 (대체 방법)
    const queryToken = client.handshake.query?.token as string;
    if (queryToken) {
      return queryToken;
    }

    return undefined;
  }
}
