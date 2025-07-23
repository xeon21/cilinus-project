# Heartbeat DB 부하 최적화 분석 및 구현

## 현재 상황 분석

### 현재 설정
- **Heartbeat 타임아웃**: 3분 (180초)
- **경고 타임아웃**: 2분 (120초)
- **상태 체크 주기**: 10초마다
- **각 heartbeat마다 DB UPDATE 쿼리 실행**

### 부하 예상
10,000개 디바이스 기준:
- 30초마다 heartbeat 시: **333 쿼리/초**
- 1분마다 heartbeat 시: **166 쿼리/초**
- 각 UPDATE 쿼리가 평균 3ms 소요 시 → 1초에 999ms~499ms DB 부하

**결론: 확실히 DB 부하 문제가 발생할 수 있음**

## 해결 방안

### 1. **배치 처리 방식** (권장)
- Heartbeat를 즉시 DB에 쓰지 않고 메모리에 저장
- 5-10초마다 변경된 디바이스들만 한 번에 UPDATE
- 장점: DB 쿼리 수 대폭 감소 (10,000개 → 수백 개/배치)
- 단점: 실시간성이 약간 떨어짐 (5-10초 지연)

### 2. **Redis 캐싱** 
- Heartbeat 정보를 Redis에 저장
- 주기적으로 Redis → MySQL 동기화
- 장점: 매우 빠른 응답 속도, DB 부하 최소화
- 단점: Redis 인프라 추가 필요

### 3. **불필요한 UPDATE 제거**
- 마지막 업데이트 시간과 비교하여 일정 시간(예: 30초) 내 중복 UPDATE 방지
- 장점: 간단한 구현으로 부하 감소
- 단점: 완전한 해결책은 아님

### 4. **DB 쿼리 최적화**
- 복수 UPDATE를 하나의 쿼리로 처리
- 인덱스 최적화
- 읽기/쓰기 DB 분리

## 추천 구현 방안

**1단계: 배치 처리 구현** (즉시 적용 가능)
```typescript
// 5초마다 배치 업데이트
private heartbeatBatch: Map<string, Date> = new Map();

// heartbeat 수신 시 메모리에만 저장
updateHeartbeat(deviceId: string) {
  this.heartbeatBatch.set(deviceId, new Date());
}

// 5초마다 배치로 DB 업데이트
@Cron('*/5 * * * * *')
async flushHeartbeatBatch() {
  if (this.heartbeatBatch.size === 0) return;
  
  const updates = Array.from(this.heartbeatBatch.entries());
  this.heartbeatBatch.clear();
  
  // 배치 UPDATE 실행
  await this.updateHeartbeatsBatch(updates);
}
```

**2단계: 중복 UPDATE 방지**
- 30초 이내 동일 디바이스의 heartbeat는 무시

**3단계: Redis 도입 검토** (선택사항)
- 더 큰 규모로 확장 시 고려

## 실제 구현 내용

### 1. Service 수정
- `heartbeatBatch` Map 추가: heartbeat를 메모리에 임시 저장
- `lastDbUpdate` Map 추가: 디바이스별 마지막 DB 업데이트 시간 추적
- `updateHeartbeat` 메서드 수정:
  - 즉시 DB 업데이트하지 않고 배치에 저장
  - 30초 이상 업데이트 안 된 경우만 즉시 업데이트
- `flushHeartbeatBatch` 메서드 추가:
  - 5초마다 실행되는 Cron job
  - 배치에 쌓인 모든 heartbeat를 한 번에 DB 업데이트

### 2. Repository 수정
- `updateHeartbeatsBatch` 메서드 추가:
  - 여러 디바이스를 한 번의 쿼리로 업데이트
  - CASE WHEN 구문 사용하여 효율적 처리

### 3. 설정 상수
```typescript
HEARTBEAT_BATCH_INTERVAL_MS = 5000; // 5초마다 배치 처리
HEARTBEAT_MIN_UPDATE_INTERVAL_MS = 30000; // 최소 DB 업데이트 간격 30초
```

### 4. 성능 개선 효과
- **이전**: 10,000개 디바이스 × 30초마다 = 333 쿼리/초
- **이후**: 5초마다 1개의 배치 쿼리 = 0.2 쿼리/초 + 중요 업데이트
- **개선율**: 약 99.9% DB 쿼리 감소

### 5. 추가 최적화 고려사항
- 배치 크기가 너무 크면 쿼리를 분할 처리
- 디바이스가 더 많아지면 Redis 도입 검토
- 읽기 전용 슬레이브 DB 활용