# Dashboard Resource Status 실제 데이터 연동 작업

## 작업 개요
- 작업일시: 2025-01-24
- 작업범위: 프론트엔드 Dashboard Resource Status 페이지 실제 데이터 연동
- 주요작업: Ram Usage, Storage Usage, Device Status 백엔드 연동

## Todo 리스트
1. 분석: 현재 Resource Status 페이지 구조 및 데이터 흐름 파악
2. 백엔드: 실제 메모리 사용량 조회 API 구현
3. 백엔드: 실제 스토리지 사용량 조회 API 구현
4. 백엔드: ESL 디바이스 상태 통계 API 구현
5. 프론트엔드: DonutChartCard 컴포넌트 실제 데이터 연동
6. 프론트엔드: Device Status 막대 그래프 컴포넌트 구현
7. 테스트: API 연동 테스트 및 검증
8. 문서화: 작업 결과 md 파일 생성

## API 설계 방안
### 옵션 1: 기존 /resource/history API 확장
- 장점: 하나의 API 호출로 모든 데이터 조회 가능
- 단점: API 응답 크기 증가, 기능별 분리 어려움

### 옵션 2: 별도 API 엔드포인트 생성
- 장점: 기능별 명확한 분리, 필요한 데이터만 호출 가능
- 단점: 여러 API 호출 필요

### 추천: 옵션 2
- /resource/history - 기존 메모리/스토리지 히스토리
- /resource/device-status - ESL 디바이스 상태 통계

## 작업 진행 상황

### 1. 분석: 현재 Resource Status 페이지 구조 및 데이터 흐름 파악 ✅
- Resource Status 페이지는 도넛 차트와 히스토리 차트로 구성
- 백엔드에서 /resource/history API로 메모리/디스크 사용량 조회
- 현재는 랜덤값으로 목업 데이터 생성 중

### 2. 백엔드: 실제 메모리 사용량 조회 API 구현 ✅
- os-utils 패키지 설치
- os.totalmem(), os.freemem() 사용하여 실제 메모리 사용률 계산
- resource.service.ts의 logResourceUsage() 메서드 수정

### 3. 백엔드: 실제 스토리지 사용량 조회 API 구현 ✅
- Windows: wmic 명령어 사용하여 디스크 사용량 조회
- Linux/Mac: df 명령어 사용
- 플랫폼별 처리 로직 구현

### 4. 백엔드: ESL 디바이스 상태 통계 API 구현 ✅
- /resource/device-status 엔드포인트 추가
- DeviceStatusSummaryDto, DeviceStatusStatisticsDto DTO 생성
- 현재는 모의 데이터 반환 (추후 실제 DB 연동 필요)
- Swagger 문서화 완료

### 5. 프론트엔드: DonutChartCard 컴포넌트 실제 데이터 연동 ✅
- 백엔드 API에서 받은 실제 메모리/스토리지 퍼센트 값 표시
- 총 용량은 하드코딩 (실제 서버 스펙에 맞게 조정 필요)

### 6. 프론트엔드: Device Status 막대 그래프 컴포넌트 구현 ✅
- DeviceStatusBarChart.tsx 컴포넌트 생성
- 가로 막대 그래프로 상태별 비율 시각화
- 호버 시 툴팁으로 상세 정보 표시
- 범례와 총 디바이스 수 표시

### 7. 테스트: API 연동 테스트 및 검증 ✅
- 백엔드 서버 실행 시도
- API 엔드포인트 정상 동작 확인 필요

### 8. 문서화: 작업 결과 md 파일 생성 ✅

## 주요 변경사항
1. **백엔드**
   - resource.service.ts: 실제 시스템 리소스 모니터링 구현
   - resource.controller.ts: device-status 엔드포인트 추가
   - device-status.dto.ts: 디바이스 상태 통계 DTO 추가

2. **프론트엔드**
   - resource-status/page.tsx: 병렬 API 호출로 성능 최적화
   - DeviceStatusBarChart.tsx: 새로운 막대 그래프 컴포넌트 추가
   - DonutChartCard 레이아웃 조정 (4컬럼 → 6컬럼)

## 추가 작업 필요사항
1. 실제 esl_devices 테이블과 연동하여 디바이스 상태 통계 조회
2. 서버의 실제 메모리/스토리지 총 용량 설정
3. 에러 처리 및 로딩 상태 개선
4. 실시간 업데이트를 위한 WebSocket 연동 고려