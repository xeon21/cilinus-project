# WebSocket 디바이스 상태 브로드캐스팅 구현

## Todo 목록
1. ✅ 백엔드: 디바이스 커넥트 이벤트 브로드캐스팅 구현
2. ✅ 백엔드: 디바이스 등록 이벤트 브로드캐스팅 구현
3. ✅ 백엔드: 디바이스 연결 종료 이벤트 브로드캐스팅 구현
4. ✅ 백엔드: 허트비트 기준 시간 초과 브로드캐스팅 구현
5. ✅ 프론트엔드: 디바이스 상태 변경 로직 구현 (inactive, ready, active, error)
6. ✅ 프론트엔드: 디바이스 로우 추가 기능 구현
7. ✅ 작업 결과 문서화

## 구현 내용

### 1. 백엔드 브로드캐스팅 이벤트

#### 1.1 디바이스 커넥트 이벤트
```typescript
// esl-device.gateway.ts - handleConnection 메서드
const broadcastData = {
  deviceId,
  socketId: clientId,
  status: 'ready',
  timestamp: new Date().toISOString(),
  eventType: 'device-connected',
};

this.server.emit('device-status-changed', broadcastData);
```

#### 1.2 디바이스 등록 이벤트
```typescript
// esl-device.gateway.ts - handleRegister 메서드
const broadcastData = {
  deviceId,
  socketId,
  status: 'active',
  timestamp: new Date().toISOString(),
  eventType: 'device-registered',
  metadata,
};

this.server.emit('device-status-changed', broadcastData);
```

#### 1.3 디바이스 연결 종료 이벤트
```typescript
// esl-device.gateway.ts - handleDisconnect 메서드
const broadcastData = {
  deviceId: disconnectedDeviceId,
  socketId: clientId,
  status: 'inactive',
  timestamp: new Date().toISOString(),
  eventType: 'device-disconnected',
};

this.server.emit('device-status-changed', broadcastData);
```

#### 1.4 허트비트 타임아웃 이벤트
```typescript
// esl-device.service.ts - checkHeartbeats 메서드
const broadcastData = {
  deviceId,
  status: 'error',
  timestamp: now.toISOString(),
  eventType: 'heartbeat-timeout',
  reason: 'timeout',
  lastHeartbeat: device.lastHeartbeat.toISOString(),
};

this.server.emit('device-status-changed', broadcastData);
```

### 2. 프론트엔드 상태 관리

#### 2.1 상태 매핑
- `inactive`: 디바이스가 비활성 상태 (기본값)
- `ready`: 디바이스가 연결되었지만 아직 등록되지 않은 상태
- `active`: 디바이스가 정상적으로 등록되고 작동 중인 상태
- `error`: 허트비트 타임아웃으로 응답이 없는 상태

#### 2.2 상태 변경 처리
```typescript
// useDeviceWebSocket.ts - handleStatusChange 메서드
let mappedStatus: 'online' | 'warning' | 'offline';
switch (data.status) {
  case 'active':
  case 'ready':
    mappedStatus = 'online';
    break;
  case 'inactive':
  case 'disconnected':
    mappedStatus = 'offline';
    break;
  case 'error':
    mappedStatus = 'offline';
    break;
  default:
    mappedStatus = 'offline';
}
```

#### 2.3 새 디바이스 로우 추가
- 실시간으로 연결된 새 디바이스는 자동으로 테이블에 추가됨
- `isNew` 플래그로 새로 추가된 디바이스 구분
- 애니메이션 효과로 시각적 피드백 제공

```typescript
// device-status/page.tsx
result.push({
  deviceId: device.deviceId,
  deviceName: device.deviceId,
  deviceType: device.metadata?.deviceType as string || 'ESL',
  storeName: device.metadata?.storeName as string || 'Unknown',
  storeCode: device.metadata?.storeCode as string || 'N/A',
  status: statusMap[device.status] || 'inactive',
  lastUpdate: device.lastHeartbeat,
  lastHeartbeat: device.lastHeartbeat,
  battery: device.metadata?.battery as number || 0,
  signal: device.metadata?.signal as number || 0,
  signalStrength: device.metadata?.signalStrength as number || 0,
  isRealtime: true,
  isNew: true // 새로 추가된 디바이스 표시
} as DeviceStatusData);
```

### 3. 시각적 효과

#### 3.1 새 디바이스 하이라이트
```css
@keyframes newRowHighlight {
  0% {
    background-color: #dbeafe;
  }
  100% {
    background-color: transparent;
  }
}
```

새로 추가된 디바이스는 2초 동안 파란색 배경으로 하이라이트되어 사용자가 쉽게 인지할 수 있습니다.

## 이벤트 흐름

1. **디바이스 연결**: 
   - 디바이스가 WebSocket 연결 → `device-connected` 이벤트 브로드캐스트 → 상태: `ready`

2. **디바이스 등록**:
   - 디바이스가 register 메시지 전송 → `device-registered` 이벤트 브로드캐스트 → 상태: `active`

3. **허트비트 정상**:
   - 디바이스가 heartbeat 전송 → `device-heartbeat-received` 이벤트 브로드캐스트 → 상태 유지

4. **허트비트 타임아웃**:
   - 3분 동안 heartbeat 없음 → `heartbeat-timeout` 이벤트 브로드캐스트 → 상태: `error`

5. **디바이스 연결 해제**:
   - WebSocket 연결 종료 → `device-disconnected` 이벤트 브로드캐스트 → 상태: `inactive`

## 테스트 방법

1. 백엔드 서버 시작
2. 프론트엔드 개발 서버 시작
3. 브라우저에서 `/device-status` 페이지 접속
4. 새 디바이스 연결 시 실시간으로 로우가 추가되는지 확인
5. 디바이스 상태 변경 시 실시간으로 업데이트되는지 확인

## 주요 변경사항

1. **통합 이벤트 사용**: 모든 디바이스 상태 변경을 `device-status-changed` 이벤트로 통합
2. **메타데이터 활용**: 디바이스 메타데이터를 활용하여 테이블에 표시할 정보 확장
3. **시각적 피드백**: 새로 추가된 디바이스와 실시간 업데이트를 시각적으로 구분
4. **오류 알림**: 디바이스 오류 발생 시 토스트 알림 표시

작업이 완료되었습니다.