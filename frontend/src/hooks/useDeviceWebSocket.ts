import { useEffect, useState, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface DeviceStatus {
  deviceId: string;
  status: 'online' | 'warning' | 'offline' | 'ready';
  lastHeartbeat: string;
  metadata?: Record<string, unknown>;
}

interface WebSocketHookReturn {
  devices: Map<string, DeviceStatus>;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  reconnectAttempts: number;
  wsUrl: string;
}

// Toast notification placeholder - replace with your actual notification system
const showNotification = (notification: {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
}) => {
  console.log(`[${notification.type.toUpperCase()}] ${notification.title}: ${notification.message}`);
  // TODO: Integrate with your notification system (e.g., react-toastify, react-hot-toast)
};

// Emergency modal placeholder - replace with your actual modal system
const showEmergencyModal = (data: {
  title: string;
  message: string;
  severity: 'high' | 'critical';
}) => {
  console.error(`[EMERGENCY ${data.severity.toUpperCase()}] ${data.title}: ${data.message}`);
  // TODO: Integrate with your modal system
};

export const useDeviceWebSocket = (): WebSocketHookReturn => {
  const [devices, setDevices] = useState<Map<string, DeviceStatus>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [wsUrl, setWsUrl] = useState<string>('');
  
  const socketRef = useRef<Socket | null>(null);

  // Heartbeat 처리
  const handleHeartbeat = useCallback((data: {
    deviceId: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }) => {
    console.log('Heartbeat received:', data);
    setDevices(prev => {
      const updated = new Map(prev);
      updated.set(data.deviceId, {
        deviceId: data.deviceId,
        status: 'online',
        lastHeartbeat: data.timestamp,
        metadata: data.data
      });
      return updated;
    });
  }, []);

  // 장애 처리
  const handleDeviceFailure = useCallback((data: {
    deviceId: string;
    reason: 'timeout' | 'disconnected';
    timestamp: string;
  }) => {
    // 데이터 검증
    if (!data || !data.deviceId) {
      console.warn('Device failure event received with invalid data:', data);
      return;
    }
    
    console.error('Device failure:', data);
    
    setDevices(prev => {
      const updated = new Map(prev);
      const device = updated.get(data.deviceId);
      
      if (device) {
        updated.set(data.deviceId, {
          ...device,
          status: 'offline',
          lastHeartbeat: data.timestamp || new Date().toISOString()
        });
      }
      
      return updated;
    });

    // UI 알림 표시
    showNotification({
      type: 'error',
      title: '디바이스 장애',
      message: `${data.deviceId} 디바이스가 ${data.reason === 'timeout' ? '응답하지 않습니다' : '연결이 끊어졌습니다'}`
    });
  }, []);

  // 상태 변경 처리 - 백엔드에서 오는 새로운 이벤트 형식 처리
  const handleStatusChange = useCallback((data: {
    deviceId: string;
    status: string;
    timestamp: string;
    eventType: string;
    socketId?: string;
    metadata?: Record<string, unknown>;
    reason?: string;
    lastHeartbeat?: string;
  }) => {
    console.log('Device status changed:', data);
    console.log('Event type:', data.eventType);
    console.log('Status:', data.status);
    
    setDevices(prev => {
      const updated = new Map(prev);
      const existingDevice = updated.get(data.deviceId);
      
      // 상태 매핑: inactive, ready, active, error -> online, warning, offline, ready
      let mappedStatus: 'online' | 'warning' | 'offline' | 'ready';
      switch (data.status) {
        case 'active':
        case 'online':
          mappedStatus = 'online';
          break;
        case 'ready':
          mappedStatus = 'ready';
          break;
        case 'inactive':
        case 'disconnected':
        case 'offline':
          mappedStatus = 'offline';
          break;
        case 'error':
          mappedStatus = 'offline';
          break;
        case 'warning':
          mappedStatus = 'warning';
          break;
        default:
          console.log(`Unknown status: ${data.status}, mapping to offline`);
          mappedStatus = 'offline';
      }
      
      if (existingDevice) {
        // 기존 디바이스 업데이트
        updated.set(data.deviceId, {
          ...existingDevice,
          status: mappedStatus,
          lastHeartbeat: data.lastHeartbeat || data.timestamp,
          metadata: data.metadata || existingDevice.metadata
        });
      } else {
        // 새 디바이스 추가
        updated.set(data.deviceId, {
          deviceId: data.deviceId,
          status: mappedStatus,
          lastHeartbeat: data.lastHeartbeat || data.timestamp,
          metadata: data.metadata
        });
      }
      
      return updated;
    });
    
    // 이벤트 타입에 따른 추가 처리
    if (data.eventType === 'heartbeat-timeout' || data.status === 'error') {
      showNotification({
        type: 'error',
        title: '디바이스 오류',
        message: `${data.deviceId} 디바이스가 응답하지 않습니다`
      });
    } else if (data.eventType === 'device-disconnected') {
      console.log(`Device ${data.deviceId} disconnected, updating to offline status`);
      showNotification({
        type: 'warning',
        title: '디바이스 연결 끊김',
        message: `${data.deviceId} 디바이스 연결이 끊어졌습니다`
      });
    }
  }, []);

  // 긴급 알림 처리
  const handleEmergencyAlert = useCallback((data: {
    type: 'EMERGENCY_ALERT';
    title: string;
    message: string;
    severity: 'high' | 'critical';
    timestamp: string;
    id: string;
  }) => {
    console.error('Emergency alert:', data);
    // 긴급 알림 UI 표시
    showEmergencyModal({
      title: data.title,
      message: data.message,
      severity: data.severity
    });
  }, []);

  useEffect(() => {
    // WebSocket 서버 URL - 백엔드 포트 3002 사용
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002';
    setWsUrl(WS_URL);
    
    console.log('Connecting to Frontend WebSocket server:', WS_URL);
    
    // Socket.IO 클라이언트 초기화 - frontend namespace 사용
    socketRef.current = io(`${WS_URL}/frontend`, {
      transports: ['websocket', 'polling'], // WebSocket과 polling 모두 지원
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      auth: {
        token: localStorage.getItem('accessToken') // JWT 인증 토큰
      }
    });

    const socket = socketRef.current;

    // 연결 이벤트 핸들러
    socket.on('connect', () => {
      console.log('Frontend WebSocket connected:', socket.id);
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      setReconnectAttempts(0);
      
      // 모든 디바이스 이벤트 구독
      socket.emit('subscribe-device-events', {}, (response: any) => {
        console.log('Device events subscription response:', response);
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('Frontend WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });
    
    // 서버 연결 성공 응답
    socket.on('connected', (data) => {
      console.log('Server connection response:', data);
    });

    socket.on('connect_error', (err) => {
      console.error('Frontend WebSocket connection error:', err);
      setConnectionStatus('error');
      
      // 에러 메시지 개선
      if (err.message === 'websocket error') {
        setError('웹소켓 연결 오류가 발생했습니다. 서버와의 연결을 재시도 중입니다.');
      } else if (err.message.includes('ECONNREFUSED')) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (err.message.includes('timeout')) {
        setError('연결 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.');
      } else {
        setError(`연결 오류: ${err.message}`);
      }
      
      setReconnectAttempts(prev => prev + 1);
      
      // 재연결 시도 알림 (5회 이상 실패 시)
      if (reconnectAttempts >= 4) {
        showNotification({
          type: 'error',
          title: '웹소켓 연결 실패',
          message: '서버와의 연결이 계속 실패하고 있습니다. 관리자에게 문의하세요.'
        });
      }
    });
    
    // 서버 에러 응답
    socket.on('error', (error) => {
      console.error('Server error:', error);
      if (error && error.message) {
        if (error.message === 'websocket error') {
          setError('웹소켓 연결 오류가 발생했습니다.');
        } else {
          setError(error.message);
        }
      }
    });

    // 비즈니스 로직 이벤트 핸들러 - 프론트엔드 웹소켓에서 수신
    socket.on('device-heartbeat-received', (data) => {
      console.log('[Frontend WebSocket] device-heartbeat-received:', data);
      handleHeartbeat(data);
    });
    
    socket.on('device-failure', (data) => {
      console.log('[Frontend WebSocket] device-failure raw data:', data);
      if (data && typeof data === 'object') {
        handleDeviceFailure(data);
      } else {
        console.warn('[Frontend WebSocket] Unexpected device-failure data format:', data);
      }
    });
    
    socket.on('device-status-changed', (data) => {
      console.log('[Frontend WebSocket] device-status-changed:', data);
      handleStatusChange(data);
    });
    
    socket.on('emergency-alert', (data) => {
      console.log('[Frontend WebSocket] emergency-alert:', data);
      handleEmergencyAlert(data);
    });
    
    socket.on('system-message', (data) => {
      console.log('[Frontend WebSocket] system-message:', data);
      // 시스템 메시지 처리 (필요시 UI에 표시)
      if (data.type === 'SYSTEM_MESSAGE') {
        showNotification({
          type: data.level as 'error' | 'warning' | 'info',
          title: '시스템 메시지',
          message: data.message
        });
      }
    });
    
    // 디버깅을 위한 모든 이벤트 로깅
    socket.onAny((eventName, ...args) => {
      console.log(`[Frontend WebSocket] Event received: ${eventName}`, args);
    });

    // Cleanup
    return () => {
      console.log('Cleaning up Frontend WebSocket connection');
      
      // 이벤트 구독 해제
      socket.emit('unsubscribe-device-events', {});
      
      socket.off('connect');
      socket.off('connected');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('error');
      socket.off('device-heartbeat-received');
      socket.off('device-failure');
      socket.off('device-status-changed');
      socket.off('emergency-alert');
      socket.off('system-message');
      socket.offAny();
      socket.close();
    };
  }, [handleHeartbeat, handleDeviceFailure, handleStatusChange, handleEmergencyAlert]);

  return {
    devices,
    isConnected,
    connectionStatus,
    error,
    reconnectAttempts,
    wsUrl
  };
};