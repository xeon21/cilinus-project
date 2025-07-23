# Frontend 디바이스 상태 실시간 업데이트 방법 조사

## Todo 목록
1. ✅ 프론트엔드에서 디바이스 상태값 실시간 업데이트 방법 조사
2. ✅ 현재 구현 상태 파악
3. ✅ 실시간 업데이트 방법 제안
4. ✅ 결과 문서화 및 저장

## 현재 구현 상태 분석

### 1. 데이터 Fetching 방식
- **현재 방식**: REST API를 통한 일회성 데이터 조회
- **문제점**: 사용자가 수동으로 새로고침해야만 최신 데이터 확인 가능
- **코드 위치**: 
  - `/frontend/src/app/device-status/page.tsx`
  - `/frontend/src/app/device-status/detail/[deviceId]/page.tsx`

### 2. 백엔드 WebSocket 지원 현황
- **이미 구현됨**: Socket.IO 기반 WebSocket 서버
- **기능**:
  - 30초 간격 하트비트 모니터링
  - `heartbeat`, `device-failure` 이벤트
  - 자동 장애 감지 및 이메일 알림
- **코드 위치**: `/backend/src/esl-device/esl-device.gateway.ts`

## 실시간 업데이트 방법 제안

### 1. WebSocket 연결 (최우선 권장) ⭐
**장점**:
- 백엔드 인프라가 이미 준비됨
- 양방향 실시간 통신
- 서버 리소스 효율적

**구현 방법**:
```typescript
// Socket.IO 클라이언트 설치
// npm install socket.io-client

// WebSocket Hook 생성
const useDeviceStatus = () => {
  const [devices, setDevices] = useState([]);
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    
    socket.on('heartbeat', (data) => {
      // 디바이스 상태 업데이트
    });
    
    socket.on('device-failure', (data) => {
      // 장애 알림 표시
    });
    
    return () => socket.disconnect();
  }, []);
  
  return devices;
};
```

### 2. Polling 방식
**장점**:
- 구현이 간단
- WebSocket 대비 호환성 높음

**구현 방법**:
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await axiosInstance.get('/device-status');
    setData(response.data);
  }, 10000); // 10초 간격
  
  return () => clearInterval(interval);
}, []);
```

### 3. React Query/SWR 활용
**장점**:
- 캐싱 및 자동 재검증
- 네트워크 상태 관리

**구현 방법**:
```typescript
// React Query 사용
const { data, error } = useQuery(
  'deviceStatus',
  fetchDeviceStatus,
  {
    refetchInterval: 10000, // 10초마다 자동 갱신
    refetchOnWindowFocus: true,
  }
);
```

### 4. Server-Sent Events (SSE)
**장점**:
- HTTP 프로토콜 사용
- 단방향 통신에 최적화

**구현 방법**:
```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/device-status/stream');
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setDevices(data);
  };
  
  return () => eventSource.close();
}, []);
```

### 5. 하이브리드 접근 (권장) ⭐
**전략**:
1. 초기 로드: REST API
2. 실시간 업데이트: WebSocket
3. 폴백: Polling (WebSocket 연결 실패 시)

**구현 방법**:
```typescript
const useHybridDeviceStatus = () => {
  const [devices, setDevices] = useState([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  
  // 초기 데이터 로드
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  // WebSocket 연결
  useEffect(() => {
    const socket = connectWebSocket();
    
    socket.on('connect', () => {
      setIsWebSocketConnected(true);
    });
    
    socket.on('disconnect', () => {
      setIsWebSocketConnected(false);
    });
    
    return () => socket.disconnect();
  }, []);
  
  // Polling 폴백
  useEffect(() => {
    if (!isWebSocketConnected) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isWebSocketConnected]);
  
  return devices;
};
```

## 권장 구현 순서

1. **Phase 1**: WebSocket 기본 연동
   - Socket.IO 클라이언트 설치
   - 기본 연결 및 이벤트 수신
   - 디바이스 상태 실시간 업데이트

2. **Phase 2**: 사용자 경험 개선
   - 연결 상태 표시
   - 재연결 로직
   - 오프라인 모드 처리

3. **Phase 3**: 고급 기능
   - 사용자 설정 가능한 업데이트 주기
   - 알림 시스템
   - 데이터 변경 하이라이트

## 예상 효과

1. **즉각적인 상태 반영**: 디바이스 장애 시 실시간 알림
2. **서버 부하 감소**: 불필요한 API 호출 최소화
3. **사용자 경험 향상**: 수동 새로고침 불필요
4. **운영 효율성**: 실시간 모니터링으로 빠른 대응 가능

## 작업 완료

모든 Todo 항목이 완료되었습니다. 프론트엔드에서 디바이스 상태를 실시간으로 업데이트하기 위한 다양한 방법을 조사하고 제안했습니다. 현재 백엔드에 WebSocket 인프라가 이미 구축되어 있으므로, WebSocket을 활용한 실시간 업데이트 구현을 최우선으로 권장합니다.