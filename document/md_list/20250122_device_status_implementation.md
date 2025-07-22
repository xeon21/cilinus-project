# Device Status 기능 구현

## 작업 일시
2025년 1월 22일

## 작업 개요
Sidebar에 '/device-status' 메뉴를 추가하고, tag-status와 동일한 UI로 device-status 기능을 구현했습니다. 백엔드에서는 esl_devices 테이블을 사용하여 디바이스 상태 정보를 제공합니다.

## 주요 작업 내용

### 1. Frontend 구현

#### 1.1 컴포넌트 생성
- `/frontend/src/app/device-status/page.tsx` - 메인 페이지 컴포넌트
- `/frontend/src/app/device-status/DeviceStatusHeader.tsx` - 헤더 컴포넌트
- `/frontend/src/app/device-status/DeviceStatusTable.tsx` - 테이블 컴포넌트

#### 1.2 주요 기능
- 정렬 기능 (useSort 훅 사용)
- 필터링 기능 (Device ID, Device Type, Store Name, Status)
- 검색 및 리셋 기능
- 상태별 배지 표시 (active: 녹색, inactive: 빨간색, maintenance: 주황색)

#### 1.3 데이터 구조
```typescript
export interface DeviceStatusData {
  deviceId: string;
  deviceType: string;
  storeName: string;
  status: string;
  lastUpdate: string;
  signal: number;
}
```

### 2. Backend 구현

#### 2.1 모듈 구조
- `/backend/src/device-status/device-status.module.ts` - 모듈 정의
- `/backend/src/device-status/device-status.controller.ts` - API 엔드포인트
- `/backend/src/device-status/device-status.service.ts` - 비즈니스 로직
- `/backend/src/device-status/device-status.repository.ts` - 데이터베이스 쿼리

#### 2.2 API 엔드포인트
- `GET /device-status` - 전체 디바이스 목록 조회
  - Query Parameters: storeCode, deviceType, status
- `GET /device-status/detail/:deviceId` - 특정 디바이스 상세 정보 조회

#### 2.3 데이터베이스 쿼리
- esl_devices 테이블 사용
- organizations 테이블과 JOIN하여 store_name 조회
- 정렬: last_heartbeat DESC

### 3. DTO 정의

#### 3.1 DeviceStatusDto
```typescript
export class DeviceStatusDto {
  deviceId: string;
  deviceType: string;
  storeName: string;
  status: string;
  lastUpdate: string;
  signal: number;
}
```

#### 3.2 DeviceDetailDto
```typescript
export class DeviceDetailDto extends DeviceStatusDto {
  firmwareVersion: string;
  installDate: string;
  lastMaintenanceDate: string;
  location: string;
  ipAddress: string;
  macAddress: string;
}
```

### 4. 주요 이슈 및 해결

#### 4.1 데이터베이스 컬럼명 불일치 문제
**문제**: SQL 쿼리에서 사용한 컬럼명이 실제 테이블 구조와 불일치
- `device_id` → `id`
- `store_name` → organizations 테이블과 JOIN 필요
- `last_update` → `last_heartbeat`

**해결**: 
- SELECT 절에서 별칭(alias) 사용
- organizations 테이블과 LEFT JOIN
- ORDER BY 절 수정

#### 4.2 불필요한 필드 제거
**제거된 필드**:
- store_code
- battery_level
- temperature
- hardware_version

### 5. Swagger 문서화
모든 API 엔드포인트에 Swagger 데코레이터 추가:
- `@ApiTags('device-status')`
- `@ApiOperation()`
- `@ApiResponse()`
- `@ApiQuery()` / `@ApiParam()`
- `@ApiBearerAuth()`

### 6. 보안
- JWT 인증 적용 (`JwtAuthGuard` 사용)
- 모든 엔드포인트에 인증 필요

### 7. 로깅
- Controller와 Service에서 Winston logger 사용
- 요청 파라미터와 응답 데이터 로깅
- 완성된 SQL 쿼리 로깅

## 파일 변경 목록

### Frontend
- ✅ `/frontend/src/app/components/layout/Sidebar.tsx` - 메뉴 추가
- ✅ `/frontend/src/app/device-status/page.tsx` - 생성
- ✅ `/frontend/src/app/device-status/DeviceStatusHeader.tsx` - 생성
- ✅ `/frontend/src/app/device-status/DeviceStatusTable.tsx` - 생성

### Backend
- ✅ `/backend/src/app.module.ts` - DeviceStatusModule import 추가
- ✅ `/backend/src/device-status/device-status.module.ts` - 생성
- ✅ `/backend/src/device-status/device-status.controller.ts` - 생성
- ✅ `/backend/src/device-status/device-status.service.ts` - 생성
- ✅ `/backend/src/device-status/device-status.repository.ts` - 생성
- ✅ `/backend/src/dto/device-status.dto.ts` - 생성

## 결과
- Device Status 페이지가 성공적으로 구현됨
- Tag Status와 동일한 UI/UX 제공
- 실시간 디바이스 상태 모니터링 가능
- 필터링 및 정렬 기능 정상 작동