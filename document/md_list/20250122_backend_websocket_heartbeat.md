# ESL 디바이스 웹소켓 하트비트 기능 구현

## 작업 개요
- 작업일시: 2025-01-22
- 작업내용: ESL 디바이스 하트비트 모니터링을 위한 WebSocket 구현
- 작업폴더: backend

## Todo List

### 1. WebSocket 모듈 설정 및 Gateway 생성 (Priority: High) ✅
- [x] WebSocket 관련 패키지 설치
- [x] ESL WebSocket Gateway 생성
- [x] WebSocket 모듈 생성 및 설정

### 2. ESL 디바이스 하트비트 DTO 및 인터페이스 정의 (Priority: High) ✅
- [x] 하트비트 메시지 DTO 생성
- [x] 디바이스 정보 인터페이스 정의
- [x] WebSocket 이벤트 타입 정의

### 3. 디바이스 연결 상태 관리 서비스 구현 (Priority: High) ✅
- [x] 디바이스 연결 상태 저장소 구현
- [x] 디바이스 등록/해제 로직 구현
- [x] 연결 상태 조회 기능 구현

### 4. 하트비트 타임아웃 처리 로직 구현 (Priority: High) ✅
- [x] 타임아웃 설정 (기본 30초)
- [x] 주기적 상태 체크 스케줄러 구현
- [x] 타임아웃 시 장애 처리 로직 구현

### 5. 장애 감지 시 이메일 알림 서비스 구현 (Priority: High) ✅
- [x] 이메일 서비스 모듈 생성
- [x] 이메일 템플릿 작성
- [x] 장애 알림 메일 발송 로직 구현

### 6. WebSocket 연결/해제 이벤트 핸들러 구현 (Priority: Medium) ✅
- [x] 클라이언트 연결 시 처리
- [x] 클라이언트 연결 해제 시 처리
- [x] 재연결 처리 로직

### 7. 디바이스 상태 로깅 기능 추가 (Priority: Medium) ✅
- [x] Winston logger 활용
- [x] 연결/해제 로그
- [x] 하트비트 수신 로그
- [x] 장애 발생 로그

### 8. Swagger 문서화 작업 (Priority: Medium) ✅
- [x] WebSocket 엔드포인트 문서화
- [x] DTO 스키마 문서화
- [x] 이벤트 타입 문서화

## 기술 스택
- NestJS WebSocket (Socket.IO)
- Nodemailer (이메일 발송)
- Winston (로깅)
- TypeScript

## 주요 기능
1. ESL 디바이스 실시간 연결 관리
2. 주기적 하트비트 체크 (기본 30초)
3. 장애 감지 시 이메일 알림
4. 디바이스 상태 실시간 모니터링

## 작업 완료 내역

### 구현된 파일
1. **esl-device.module.ts**: ESL 디바이스 모듈 정의
2. **esl-device.gateway.ts**: WebSocket Gateway 구현
   - 연결/해제 핸들링
   - 디바이스 등록/해제
   - 하트비트 수신
   - 상태 조회
3. **esl-device.service.ts**: 비즈니스 로직 구현
   - 디바이스 상태 관리
   - 타임아웃 체크 (10초마다 실행)
   - 장애 감지 및 알림
4. **esl-device.controller.ts**: REST API 엔드포인트
   - GET /api/esl-device/status - 모든 디바이스 상태
   - GET /api/esl-device/status/:deviceId - 특정 디바이스 상태
   - POST /api/esl-device/test-email - 이메일 테스트
5. **email.module.ts & email.service.ts**: 이메일 서비스
   - SMTP 설정
   - 장애 알림 메일 템플릿
6. **esl-device.dto.ts**: DTO 및 인터페이스 정의
7. **test-esl-websocket.html**: 테스트 클라이언트

### WebSocket 이벤트
- **connect**: 클라이언트 연결
- **register**: 디바이스 등록
- **heartbeat**: 하트비트 전송
- **status**: 상태 조회
- **unregister**: 디바이스 등록 해제
- **device-failure**: 장애 알림 (서버 → 클라이언트)

### 환경변수 추가 (.env.example)
```
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cilinus System" <no-reply@cilinus.com>

# Admin Email Addresses (comma-separated)
ADMIN_EMAILS=admin@cilinus.com,manager@cilinus.com
```

### 사용 방법
1. 백엔드 서버 실행: `npm run start:dev`
2. 브라우저에서 `test-esl-websocket.html` 열기
3. Connect → Register Device → Send Heartbeat
4. Auto Heartbeat 체크하면 10초마다 자동 전송
5. 30초 이상 하트비트가 없으면 장애로 판단하여 이메일 발송

### 로깅
- 모든 주요 이벤트는 Winston logger로 기록
- 개발 모드에서는 상세한 디버그 로그 출력
- 쿼리 파라미터 및 요청/응답 데이터 로깅

### Swagger 문서
- `/api-docs`에서 ESL Device 관련 API 문서 확인 가능
- JWT 인증 필요 (Bearer Token)