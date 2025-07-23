# ESL Device Register Status Update

## 작업 시작 시간: 2025-01-23 09:30:00

## Todo 목록

1. ✅ document/cilinus.sql에서 esl_devices 스키마 확인
2. ✅ 웹소켓 gateway에서 device register 이벤트 처리 확인
3. ✅ esl-device service에 DB status 업데이트 메서드 추가
4. ✅ 웹소켓 register 이벤트와 DB 업데이트 연동
5. ✅ 작업 결과 문서화 및 저장

## 작업 내용

### 1. esl_devices 스키마 확인

- `esl_devices` 테이블에 다음 필드 확인:
  - `mac_address`: 디바이스 고유 식별자 (웹소켓의 deviceId로 사용)
  - `status`: 디바이스 상태 (active, inactive, error)
  - `last_heartbeat`: 마지막 heartbeat 시간
  - `updated_at`: 마지막 업데이트 시간

### 2. 새로운 Repository 생성

`backend/src/esl-device/esl-device.repository.ts` 파일 생성:
- `updateDeviceStatus`: 디바이스 상태 업데이트 메서드
- `updateDeviceHeartbeat`: heartbeat 시간 업데이트 메서드
- `getDeviceByMacAddress`: MAC 주소로 디바이스 조회 메서드
- 모든 쿼리문을 파라미터가 적용된 완성된 형태로 logger에 기록

### 3. Service 수정

`esl-device.service.ts` 파일 수정:
- Repository 주입 및 사용
- `registerDevice`: 디바이스 등록 시 DB status를 'active'로 업데이트
- `unregisterDevice`: 디바이스 해제 시 DB status를 'inactive'로 업데이트
- `updateHeartbeat`: heartbeat 업데이트 시 DB의 last_heartbeat도 업데이트
- `handleDeviceDisconnect`: 연결 해제 시 DB status를 'inactive'로 업데이트
- `checkHeartbeats`: 타임아웃 시 DB status를 'error'로 업데이트
- 모든 메서드를 async/await로 변경

### 4. Gateway 수정

`esl-device.gateway.ts` 파일 수정:
- `handleRegister`: async로 변경하여 DB 업데이트 대기
- `handleHeartbeat`: async로 변경하여 DB 업데이트 대기
- `handleUnregister`: async로 변경하여 DB 업데이트 대기

### 5. Module 수정

`esl-device.module.ts` 파일 수정:
- providers에 `EslDeviceRepository` 추가

## 구현 요약

웹소켓에서 디바이스가 register 이벤트를 보내면:
1. Gateway에서 register 이벤트 수신
2. Service의 registerDevice 메서드 호출
3. 메모리에 디바이스 정보 저장
4. Repository를 통해 DB의 해당 디바이스 status를 'active'로 업데이트
5. 성공 응답 반환

추가로 구현된 기능:
- Heartbeat 시 DB의 last_heartbeat 업데이트
- 연결 해제 시 status를 'inactive'로 변경
- 타임아웃 발생 시 status를 'error'로 변경
- 모든 DB 쿼리는 로그에 기록

## 참고사항

- deviceId는 MAC 주소 형식으로 전달되어야 함 (예: "AA:BB:CC:DD:EE:FF")
- DB 업데이트 실패 시에도 웹소켓 연결은 유지됨
- 모든 상태 변경은 로그에 기록됨