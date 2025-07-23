# WebSocket 실시간 업데이트 문제 해결

## Todo 목록
1. ✅ WebSocket 실시간 업데이트 문제 디버깅
2. ✅ 백엔드 WebSocket 이벤트 발생 확인
3. ✅ 프론트엔드 이벤트 수신 로그 확인
4. ✅ 데이터 병합 로직 검증
5. ✅ 문제 해결 및 수정
6. ✅ 작업 결과 문서화

## 문제 원인

실시간 업데이트가 작동하지 않던 이유는 백엔드와 프론트엔드 간의 이벤트 불일치 때문이었습니다:

1. **백엔드 동작**:
   - ESL 디바이스가 `heartbeat` 이벤트를 보냄
   - 백엔드는 해당 디바이스에게만 `heartbeat-ack` 응답을 보냄
   - 다른 모니터링 클라이언트들에게는 브로드캐스트하지 않음

2. **프론트엔드 기대**:
   - 모니터링 대시보드는 모든 디바이스의 상태 변경을 실시간으로 받기를 기대
   - `heartbeat` 이벤트를 수신하려 했으나, 이는 디바이스가 보내는 이벤트임

## 해결 방법

### 1. 백엔드 수정 (`esl-device.gateway.ts`)
```typescript
// 디바이스로부터 heartbeat를 받으면 모든 모니터링 클라이언트에게 브로드캐스트
if (result) {
  client.emit('heartbeat-ack', {
    received: true,
    timestamp: receiveTime.toISOString(),
    deviceId: heartbeatData.deviceId,
  });
  
  // 모든 클라이언트에게 디바이스 상태 업데이트 브로드캐스트
  const broadcastData = {
    deviceId: heartbeatData.deviceId,
    timestamp: receiveTime.toISOString(),
    status: 'online',
    data: heartbeatData.data,
  };
  
  this.server.emit('device-heartbeat-received', broadcastData);
  
  this.logger.log(
    `Heartbeat acknowledged and broadcasted for device ${heartbeatData.deviceId}. Broadcast data: ${JSON.stringify(broadcastData)}`,
  );
}
```

### 2. 프론트엔드 수정 (`useDeviceWebSocket.ts`)
```typescript
// 올바른 이벤트 수신
socket.on('device-heartbeat-received', handleHeartbeat);
socket.on('device-failure', handleDeviceFailure);
socket.on('device-status-changed', handleStatusChange);
socket.on('emergency-alert', handleEmergencyAlert);

// 디버깅을 위한 모든 이벤트 로깅
socket.onAny((eventName, ...args) => {
  console.log(`[WebSocket] Event received: ${eventName}`, args);
});
```

## 주요 변경사항

1. **새로운 브로드캐스트 이벤트**: `device-heartbeat-received`
   - 디바이스가 heartbeat를 보낼 때마다 모든 클라이언트에게 전송
   - 실시간 상태 업데이트 가능

2. **디버깅 기능 추가**:
   - `socket.onAny()`로 모든 이벤트 로깅
   - 백엔드에 브로드캐스트 로깅 추가

3. **이벤트 정리**:
   - `heartbeat`: 디바이스 → 서버
   - `heartbeat-ack`: 서버 → 디바이스
   - `device-heartbeat-received`: 서버 → 모든 모니터링 클라이언트

## 테스트 방법

1. 백엔드 서버 재시작
2. 프론트엔드 개발 서버 재시작
3. 브라우저 개발자 도구 콘솔 열기
4. `/device-status` 페이지 접속
5. 콘솔에서 WebSocket 이벤트 로그 확인
6. 디바이스가 heartbeat를 보낼 때 UI가 자동 업데이트되는지 확인

## 기대 효과

- 디바이스 상태가 실시간으로 자동 업데이트됨
- 새로고침 없이 최신 상태 확인 가능
- 장애 발생 시 즉시 알림 표시

작업이 완료되었습니다. 이제 디바이스 상태가 실시간으로 업데이트됩니다.