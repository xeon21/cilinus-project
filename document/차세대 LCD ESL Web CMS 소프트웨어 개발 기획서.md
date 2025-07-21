# 차세대 LCD ESL Web CMS 소프트웨어 개발 기획서 (수정본)

## 1. 개발 목표 및 범위 (V1.0)

### 1.1 프로젝트 개요

차세대 LCD ESL(Electronic Shelf Label) 관리를 위한 클라우드 기반 웹 CMS 플랫폼을 개발하여, 대형마트부터 편의점까지 다양한 규모의 소매점에서 가격표 관리를 디지털화하고 자동화합니다.

### 1.2 핵심 목표

- **실시간 가격 관리**: POS 시스템과 연동된 즉각적인 가격 업데이트
- **대형 디스플레이 최적화**: 23인치/29인치 LCD 디스플레이에 최적화된 콘텐츠 관리
- **확장 가능한 아키텍처**: 10,000개 이상의 ESL 디바이스 동시 관리 가능
- **직관적인 사용자 경험**: 비기술직 직원도 쉽게 사용 가능한 인터페이스
- **유연한 템플릿 시스템**: 디바이스 레이아웃과 개별 태그 디자인을 독립적으로 관리

### 1.3 V1.0 MVP 범위

**포함 기능**:

- ESL 디바이스 등록 및 기본 관리
- 디바이스 템플릿 시스템 (레이아웃 관리)
- 태그 템플릿 시스템 (콘텐츠 디자인)
- 템플릿 기반 콘텐츠 생성 (각 5개 기본 템플릿)
- 실시간 가격 업데이트 (수동/API)
- 디바이스 상태 모니터링 대시보드
- 기본 사용자 권한 관리 (관리자/운영자)
- POS 시스템 기본 연동

**제외 기능** (V2.0 이후):

- 고급 템플릿 에디터
- 캠페인 스케줄링
- 상세 분석 리포트
- 모바일 앱
- 다중 언어 지원

## 2. 시스템 아키텍처 및 기술 스택

### 2.1 3-Tier Architecture 구조

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│         React.js 18.2 + TypeScript + Ant Design         │
│                  Nginx (Reverse Proxy)                  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
│              Node.js 18 + Express.js 4.18               │
│          WebSocket (Socket.io) + JWT Auth               │
│                    Redis (Caching)                      │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                         │
│               PostgreSQL 14 (Primary DB)                │
│              AWS RDS (Multi-AZ Deployment)              │
│                AWS S3 (File Storage)                    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 AWS 인프라 구성

```yaml
Production Environment:
  Compute:
    - EC2 t3.medium (2) - Application Servers
    - Application Load Balancer
    - Auto Scaling Group (2-6 instances)
  
  Storage:
    - RDS PostgreSQL db.t3.medium (Multi-AZ)
    - S3 Bucket for templates/images
    - ElastiCache Redis cache.t3.micro
  
  Networking:
    - VPC with public/private subnets
    - CloudFront CDN
    - Route 53 DNS
  
  IoT Services:
    - AWS IoT Core (MQTT broker)
    - AWS IoT Device Management
    - Lambda functions for device events
```

### 2.3 기술 스택 상세

**Frontend**:

- React.js 18.2 with Hooks
- TypeScript 4.9
- Ant Design 5.0 (UI Components)
- React Query (서버 상태 관리)
- React Router v6
- Axios (HTTP client)
- Socket.io-client (실시간 통신)

**Backend**:

- Node.js 18 LTS
- Express.js 4.18
- TypeScript 4.9
- Socket.io (WebSocket)
- JWT (jsonwebtoken)
- Bcrypt (암호화)
- AWS SDK v3
- MQTT.js (ESL 통신)

**Database & Cache**:

- PostgreSQL 14
- Redis 7.0
- TypeORM (ORM)

## 3. 데이터베이스 스키마

### 3.1 핵심 테이블 구조

```sql
-- 조직/테넌트 관리 (계층 구조 추가)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'headquarters', 'branch', 'store'
    level INTEGER NOT NULL DEFAULT 0, -- 계층 깊이 (0: 최상위)
    path VARCHAR(500), -- 계층 경로 (예: "1/5/12")
    -- 주소 정보 추가
    address VARCHAR(500), -- 도로명 주소
    address_detail VARCHAR(255), -- 상세 주소
    postal_code VARCHAR(10), -- 우편번호
    city VARCHAR(100), -- 시/도
    district VARCHAR(100), -- 구/군
    latitude DECIMAL(10, 8), -- 위도
    longitude DECIMAL(11, 8), -- 경도
    phone VARCHAR(20), -- 대표 전화번호
    business_hours JSONB, -- 영업시간 정보
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 사용자 관리
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'super_admin', 'org_admin', 'manager', 'operator'
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 디바이스 템플릿 관리 (새로 추가)
CREATE TABLE device_templates (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    device_type VARCHAR(20) NOT NULL, -- '23inch', '29inch'
    layout_type VARCHAR(50) NOT NULL, -- 'grid_2x2', 'grid_1x4', 'grid_2x3', 'custom'
    max_tags INTEGER NOT NULL, -- 레이아웃의 최대 태그 수
    grid_config JSONB NOT NULL, -- 그리드 레이아웃 설정
    preview_url VARCHAR(500),
    is_default BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ESL 디바이스 관리 (수정됨 - 템플릿 참조 추가)
CREATE TABLE esl_devices (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    device_template_id INTEGER REFERENCES device_templates(id),
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL, -- '23inch', '29inch'
    firmware_version VARCHAR(50),
    location_store VARCHAR(255),
    location_aisle VARCHAR(50),
    location_shelf VARCHAR(50),
    battery_level INTEGER,
    signal_strength INTEGER,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'error'
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 태그 템플릿 관리 (기존 templates 테이블 대체)
CREATE TABLE tag_templates (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'price_tag', 'promotion', 'info', 'custom'
    size_type VARCHAR(20) NOT NULL, -- 'small', 'medium', 'large', 'flexible'
    min_width INTEGER NOT NULL, -- 최소 너비 (픽셀)
    min_height INTEGER NOT NULL, -- 최소 높이 (픽셀)
    aspect_ratio VARCHAR(20), -- '1:1', '4:3', '16:9', 'flexible'
    layout_config JSONB NOT NULL, -- 템플릿 레이아웃 설정
    preview_url VARCHAR(500),
    category VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 프라이스 태그 관리 (수정됨)
CREATE TABLE price_tags (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES esl_devices(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    tag_template_id INTEGER REFERENCES tag_templates(id),
    grid_position INTEGER NOT NULL, -- 그리드 내 위치 (0부터 시작)
    grid_width INTEGER DEFAULT 1, -- 그리드 셀 너비 (colspan)
    grid_height INTEGER DEFAULT 1, -- 그리드 셀 높이 (rowspan)
    custom_position JSONB, -- 커스텀 레이아웃용 좌표
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER NOT NULL, -- 표시 순서
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(device_id, grid_position) -- 디바이스별 위치는 유일해야 함
);

-- 상품 정보
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    current_price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'KRW',
    unit VARCHAR(50),
    stock_level INTEGER DEFAULT 0,
    is_promotion BOOLEAN DEFAULT false,
    promotion_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, sku)
);

-- 콘텐츠 업데이트 기록 (수정됨)
CREATE TABLE content_updates (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES esl_devices(id),
    price_tag_id INTEGER REFERENCES price_tags(id),
    product_id INTEGER REFERENCES products(id),
    tag_template_id INTEGER REFERENCES tag_templates(id),
    update_type VARCHAR(50), -- 'price', 'template', 'full', 'layout', 'device_template'
    status VARCHAR(20), -- 'pending', 'in_progress', 'completed', 'failed'
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- 시스템 로그
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_organizations_parent ON organizations(parent_id);
CREATE INDEX idx_organizations_path ON organizations(path);
CREATE INDEX idx_devices_org_status ON esl_devices(organization_id, status);
CREATE INDEX idx_devices_template ON esl_devices(device_template_id);
CREATE INDEX idx_devices_heartbeat ON esl_devices(last_heartbeat);
CREATE INDEX idx_price_tags_device ON price_tags(device_id, is_active);
CREATE INDEX idx_price_tags_product ON price_tags(product_id);
CREATE INDEX idx_price_tags_template ON price_tags(tag_template_id);
CREATE INDEX idx_products_org_sku ON products(organization_id, sku);
CREATE INDEX idx_updates_device_status ON content_updates(device_id, status);
CREATE INDEX idx_updates_price_tag ON content_updates(price_tag_id, status);
CREATE INDEX idx_logs_org_created ON system_logs(organization_id, created_at);
```

### 3.2 디바이스 템플릿 JSON 구조

```json
{
  "version": "1.0",
  "deviceType": "23inch",
  "layoutType": "grid_2x2",
  "dimensions": {
    "width": 1920,
    "height": 632
  },
  "grid": {
    "rows": 2,
    "columns": 2,
    "gap": 10,
    "padding": {
      "top": 10,
      "right": 10,
      "bottom": 10,
      "left": 10
    }
  },
  "cells": [
    {
      "position": 0,
      "row": 0,
      "col": 0,
      "rowSpan": 1,
      "colSpan": 1,
      "width": 945,
      "height": 301
    },
    {
      "position": 1,
      "row": 0,
      "col": 1,
      "rowSpan": 1,
      "colSpan": 1,
      "width": 945,
      "height": 301
    },
    {
      "position": 2,
      "row": 1,
      "col": 0,
      "rowSpan": 1,
      "colSpan": 1,
      "width": 945,
      "height": 301
    },
    {
      "position": 3,
      "row": 1,
      "col": 1,
      "rowSpan": 1,
      "colSpan": 1,
      "width": 945,
      "height": 301
    }
  ],
  "background": {
    "color": "#F5F5F5",
    "image": null
  }
}
```

### 3.3 태그 템플릿 JSON 구조

```json
{
  "version": "1.0",
  "templateType": "price_tag",
  "sizeType": "medium",
  "dimensions": {
    "minWidth": 400,
    "minHeight": 250,
    "aspectRatio": "16:10"
  },
  "background": {
    "color": "#FFFFFF",
    "borderRadius": 8,
    "shadow": {
      "x": 0,
      "y": 2,
      "blur": 4,
      "color": "rgba(0,0,0,0.1)"
    }
  },
  "elements": [
    {
      "id": "product_name",
      "type": "text",
      "position": { "x": "5%", "y": "5%" },
      "size": { "width": "90%", "height": "20%" },
      "style": {
        "fontSize": "responsive",
        "fontSizeMin": 18,
        "fontSizeMax": 28,
        "fontWeight": "bold",
        "color": "#000000",
        "align": "center",
        "overflow": "ellipsis"
      },
      "dataBinding": "product.name"
    },
    {
      "id": "current_price",
      "type": "text",
      "position": { "x": "5%", "y": "35%" },
      "size": { "width": "90%", "height": "30%" },
      "style": {
        "fontSize": "responsive",
        "fontSizeMin": 32,
        "fontSizeMax": 48,
        "fontWeight": "bold",
        "color": "#FF0000",
        "align": "center"
      },
      "dataBinding": "product.current_price",
      "format": "currency"
    },
    {
      "id": "unit_price",
      "type": "text",
      "position": { "x": "5%", "y": "70%" },
      "size": { "width": "90%", "height": "15%" },
      "style": {
        "fontSize": "responsive",
        "fontSizeMin": 12,
        "fontSizeMax": 16,
        "color": "#666666",
        "align": "center"
      },
      "dataBinding": "product.unit_price",
      "format": "unit_currency"
    },
    {
      "id": "promotion_badge",
      "type": "shape",
      "position": { "x": "80%", "y": "5%" },
      "size": { "width": "15%", "height": "15%" },
      "visible": "{product.is_promotion}",
      "style": {
        "backgroundColor": "#FF6B6B",
        "borderRadius": "50%"
      },
      "children": [
        {
          "type": "text",
          "text": "SALE",
          "style": {
            "fontSize": "responsive",
            "fontSizeMin": 10,
            "fontSizeMax": 14,
            "color": "#FFFFFF",
            "fontWeight": "bold"
          }
        }
      ]
    }
  ]
}
```

## 4. 상세 기능 요구사항 명세서

### 4.1 계층적 조직 관리 기능

**사용자 스토리**: 본사 관리자로서, 전국의 모든 지점과 매장을 계층 구조로 관리하고, 각 레벨별로 적절한 권한을 부여하고 싶다.

**성공 시나리오**:

1. Super Admin이 조직 관리 페이지 접속
2. 최상위 조직(본사) 생성
3. 본사 하위에 지역별 지점 추가
4. 각 지점 하위에 개별 매장 추가
5. 트리 구조로 전체 조직도 확인
6. 각 조직에 관리자 할당

**인수 조건**:

- 최대 5단계까지 계층 구조 지원
- 드래그 앤 드롭으로 조직 이동
- 상위 조직 사용자는 하위 조직 데이터 조회 가능
- 순환 참조 방지 검증

### 4.2 조직 지도 표시 기능

**사용자 스토리**: 본사 관리자로서, 전국의 모든 매장 위치를 지도에서 한눈에 확인하고, 지역별로 필터링하여 관리하고 싶다.

**성공 시나리오**:

1. 조직 관리 페이지에서 "지도 보기" 탭 선택
2. 전국 지도에 모든 조직 위치 마커 표시
3. 조직 타입별 다른 아이콘 표시 (본사/지점/매장)
4. 지도 확대/축소로 클러스터링 자동 조절
5. 마커 클릭 시 조직 상세 정보 팝업
6. 좌측 패널에서 조직 트리와 연동
7. 특정 지역/조직 타입으로 필터링

**인수 조건**:

- 카카오맵 또는 네이버맵 API 통합
- 실시간 위치 정보 업데이트
- 모바일 반응형 지도 UI
- 1,000개 이상 마커 성능 최적화
- 주소 검색 및 지오코딩 지원

### 4.3 디바이스 템플릿 관리 기능

**사용자 스토리**: 매장 관리자로서, 디바이스의 화면을 효율적으로 분할하여 여러 상품을 표시할 수 있는 레이아웃을 선택하고 관리하고 싶다.

**성공 시나리오**:

1. 디바이스 템플릿 관리 페이지 접속
2. 디바이스 타입(23/29인치) 선택
3. 기본 제공 레이아웃 확인 (2x2, 1x4, 2x3 등)
4. 레이아웃 미리보기 확인
5. 커스텀 레이아웃 생성 옵션
6. 그리드 설정 (행/열, 간격, 여백)
7. 템플릿 저장 및 공유

**인수 조건**:

- 23인치: 최대 6개 그리드
- 29인치: 최대 12개 그리드
- 반응형 그리드 자동 계산
- 실시간 미리보기
- 조직 내 템플릿 공유

### 4.3 태그 템플릿 관리 기능

**사용자 스토리**: 마케팅 담당자로서, 상품 종류나 프로모션에 따라 다양한 디자인의 가격표를 만들어 사용하고 싶다.

**성공 시나리오**:

1. 태그 템플릿 관리 페이지 접속
2. 템플릿 타입 선택 (가격표, 프로모션, 정보 등)
3. 크기 유형 선택 (소/중/대/유동적)
4. 디자인 요소 편집
5. 데이터 바인딩 설정
6. 반응형 크기 설정
7. 카테고리별 자동 적용 규칙 설정

**인수 조건**:

- 최소/최대 크기 제한
- 종횡비 유지 옵션
- 반응형 폰트 크기
- 조건부 요소 표시
- 실시간 데이터 미리보기

### 4.4 디바이스 관리 기능 (수정)

**사용자 스토리**: 매장 관리자로서, 새로운 ESL 디바이스를 시스템에 등록하고 적절한 디바이스 템플릿을 적용하고 싶다.

**성공 시나리오**:

1. 관리자가 디바이스 관리 페이지 접속
2. "새 디바이스 등록" 버튼 클릭
3. MAC 주소 입력 또는 QR 코드 스캔
4. 디바이스 위치 정보 입력 (매장/통로/선반)
5. 디바이스 템플릿 선택 (예: 2x2 그리드)
6. 시스템이 디바이스와 연결 확인
7. 선택한 템플릿에 따라 빈 태그 슬롯 자동 생성
8. 디바이스가 목록에 표시되고 상태가 "활성"으로 표시

**인수 조건**:

- 디바이스 등록 시 3초 이내 연결 확인
- 중복 MAC 주소 검증
- 템플릿 호환성 자동 확인
- 등록 완료 시 실시간 알림

### 4.5 프라이스 태그 할당 기능

**사용자 스토리**: 매장 직원으로서, 디바이스의 각 태그 슬롯에 상품을 할당하고 적절한 태그 템플릿을 적용하고 싶다.

**성공 시나리오**:

1. 디바이스 상세 페이지에서 태그 관리 접속
2. 디바이스 템플릿에 따른 그리드 레이아웃 표시
3. 빈 태그 슬롯 선택
4. 상품 검색 및 선택
5. 해당 슬롯 크기에 맞는 태그 템플릿 목록 표시
6. 태그 템플릿 선택 및 미리보기
7. 태그 할당 및 디바이스에 전송

**인수 조건**:

- 슬롯 크기에 맞는 템플릿만 표시
- 드래그 앤 드롭 지원
- 실시간 미리보기
- 일괄 할당 기능
- 태그별 개별 업데이트

### 4.6 템플릿 변경 관리 기능

**사용자 스토리**: IT 관리자로서, 디바이스 템플릿이나 태그 템플릿을 변경할 때 영향받는 디바이스와 태그를 확인하고 안전하게 업데이트하고 싶다.

**성공 시나리오**:

1. 템플릿 관리에서 변경할 템플릿 선택
2. 템플릿 수정 사항 적용
3. 영향받는 디바이스/태그 목록 표시
4. 변경 영향도 분석 리포트 확인
5. 테스트 디바이스에 먼저 적용
6. 단계별 롤아웃 계획 설정
7. 전체 적용 및 모니터링

**인수 조건**:

- 영향도 사전 분석
- 롤백 계획 수립
- 단계별 적용 옵션
- 실시간 업데이트 추적
- 오류 발생 시 자동 중단

### 4.7 계층적 모니터링 대시보드

**사용자 스토리**: 본사 IT 관리자로서, 전국 모든 매장의 ESL 상태를 계층 구조로 한눈에 파악하고 문제를 신속히 해결하고 싶다.

**성공 시나리오**:

1. 대시보드 접속 시 조직 트리 표시
2. 각 조직별 디바이스 상태 요약
3. 문제 있는 조직 하이라이트
4. 조직 클릭 시 하위 조직으로 드릴다운
5. 특정 매장의 디바이스 상세 상태 확인
6. 디바이스의 템플릿 적용 현황 확인
7. 원격 템플릿 변경 또는 재시작 실행

**인수 조건**:

- 계층별 집계 통계 제공
- 실시간 상태 업데이트 (5초 주기)
- 템플릿별 사용 현황
- 문제 발생 시 상위 조직에 전파
- 배터리 부족, 오프라인 등 상태별 알림

## 5. RESTful API 명세

### 5.1 인증 API

```yaml
POST /api/v1/auth/login
  Request:
    {
      "email": "user@example.com",
      "password": "password123"
    }
  Response:
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "org_admin",
        "organization": {
          "id": 5,
          "name": "이마트 강남점",
          "level": 2,
          "path": "1/3/5"
        }
      }
    }

POST /api/v1/auth/refresh
  Headers: Authorization: Bearer {refresh_token}
```

### 5.2 조직 관리 API

```yaml
GET /api/v1/organizations/tree
  Query Parameters:
    - root_id: number (특정 조직부터 시작)
    - depth: number (표시할 계층 깊이)
  Response:
    {
      "data": {
        "id": 1,
        "name": "이마트",
        "type": "headquarters",
        "address": "서울시 성동구 뚝섬로 377",
        "latitude": 37.5381,
        "longitude": 127.0481,
        "children": [
          {
            "id": 3,
            "name": "이마트 서울지역",
            "type": "branch",
            "children": [
              {
                "id": 5,
                "name": "이마트 강남점",
                "type": "store",
                "address": "서울시 강남구 영동대로 502",
                "latitude": 37.5063,
                "longitude": 127.0539,
                "device_count": 150,
                "active_count": 145
              }
            ]
          }
        ]
      }
    }

POST /api/v1/organizations
  Request:
    {
      "parent_id": 3,
      "name": "이마트 서초점",
      "type": "store",
      "address": "서울시 서초구 서초대로 210",
      "address_detail": "지하 1층",
      "postal_code": "06666",
      "city": "서울시",
      "district": "서초구",
      "phone": "02-3486-9000",
      "business_hours": {
        "weekday": "10:00-22:00",
        "weekend": "10:00-23:00"
      }
    }

GET /api/v1/organizations/{id}/descendants
  Response: 해당 조직의 모든 하위 조직 목록

GET /api/v1/organizations/map
  Query Parameters:
    - bounds: string (지도 영역 좌표 "sw_lat,sw_lng,ne_lat,ne_lng")
    - type: headquarters|branch|store (조직 타입 필터)
    - include_descendants: boolean (하위 조직 포함)
    - cluster: boolean (클러스터링 사용 여부)
  Response:
    {
      "data": [
        {
          "id": 5,
          "name": "이마트 강남점",
          "type": "store",
          "latitude": 37.5063,
          "longitude": 127.0539,
          "address": "서울시 강남구 영동대로 502",
          "device_count": 150,
          "online_count": 145,
          "offline_count": 5,
          "parent_path": "이마트 > 서울지역"
        }
      ],
      "clusters": [
        {
          "latitude": 37.5665,
          "longitude": 126.9780,
          "count": 15,
          "zoom_level": 10
        }
      ]
    }

PUT /api/v1/organizations/{id}/location
  Request:
    {
      "address": "서울시 강남구 영동대로 502",
      "latitude": 37.5063,
      "longitude": 127.0539,
      "update_descendants": false
    }

POST /api/v1/organizations/geocode
  Request:
    {
      "address": "서울시 강남구 영동대로 502"
    }
  Response:
    {
      "latitude": 37.5063,
      "longitude": 127.0539,
      "formatted_address": "서울특별시 강남구 영동대로 502",
      "postal_code": "06182"
    }
```

### 5.3 디바이스 템플릿 API

```yaml
GET /api/v1/device-templates
  Query Parameters:
    - device_type: 23inch|29inch
    - layout_type: grid_2x2|grid_1x4|grid_2x3|custom
    - organization_id: number
  Response:
    {
      "data": [
        {
          "id": 1,
          "name": "표준 2x2 그리드",
          "device_type": "23inch",
          "layout_type": "grid_2x2",
          "max_tags": 4,
          "preview_url": "https://...",
          "usage_count": 45
        }
      ]
    }

POST /api/v1/device-templates
  Request:
    {
      "name": "커스텀 3열 레이아웃",
      "device_type": "29inch",
      "layout_type": "custom",
      "max_tags": 6,
      "grid_config": {
        "rows": 2,
        "columns": 3,
        "gap": 15
      }
    }

GET /api/v1/device-templates/{id}/preview
  Response: 템플릿 미리보기 데이터
```

### 5.4 태그 템플릿 API

```yaml
GET /api/v1/tag-templates
  Query Parameters:
    - template_type: price_tag|promotion|info|custom
    - size_type: small|medium|large|flexible
    - category: string
    - min_width: number
    - min_height: number
  Response:
    {
      "data": [
        {
          "id": 1,
          "name": "기본 가격표",
          "template_type": "price_tag",
          "size_type": "medium",
          "min_width": 400,
          "min_height": 250,
          "aspect_ratio": "16:10",
          "preview_url": "https://..."
        }
      ]
    }

POST /api/v1/tag-templates
  Request:
    {
      "name": "프로모션 강조형",
      "template_type": "promotion",
      "size_type": "large",
      "min_width": 600,
      "min_height": 400,
      "layout_config": {...}
    }

GET /api/v1/tag-templates/{id}/compatible-slots
  Query Parameters:
    - device_template_id: number
  Response: 호환 가능한 슬롯 위치 목록
```

### 5.5 디바이스 관리 API

```yaml
GET /api/v1/devices
  Query Parameters:
    - include_descendants: boolean (하위 조직 포함)
    - status: active|inactive|error
    - device_template_id: number
  Response:
    {
      "data": [
        {
          "id": 1,
          "mac_address": "AA:BB:CC:DD:EE:FF",
          "device_type": "23inch",
          "status": "active",
          "device_template": {
            "id": 1,
            "name": "표준 2x2 그리드",
            "max_tags": 4
          },
          "tag_usage": "3/4",
          "organization": {
            "id": 5,
            "name": "이마트 강남점"
          }
        }
      ]
    }

POST /api/v1/devices
  Request:
    {
      "mac_address": "AA:BB:CC:DD:EE:FF",
      "device_type": "23inch",
      "device_template_id": 1,
      "location": {
        "store": "강남점",
        "aisle": "A-12",
        "shelf": "3"
      }
    }

PUT /api/v1/devices/{id}/template
  Request:
    {
      "device_template_id": 2,
      "migrate_tags": true
    }
  Response:
    {
      "migration_plan": {
        "compatible_tags": 3,
        "incompatible_tags": 1,
        "new_empty_slots": 2
      }
    }
```

### 5.6 프라이스 태그 API

```yaml
GET /api/v1/devices/{device_id}/tags
  Response:
    {
      "device_id": 123,
      "device_template": {
        "id": 1,
        "layout_type": "grid_2x2"
      },
      "tags": [
        {
          "id": 1,
          "grid_position": 0,
          "grid_width": 1,
          "grid_height": 1,
          "product": {
            "id": 1001,
            "name": "서울우유 1L",
            "current_price": 3500
          },
          "tag_template": {
            "id": 5,
            "name": "기본 가격표",
            "size_type": "medium"
          }
        }
      ]
    }

POST /api/v1/devices/{device_id}/tags
  Request:
    {
      "grid_position": 0,
      "product_id": 1001,
      "tag_template_id": 5,
      "grid_width": 1,
      "grid_height": 1
    }

PUT /api/v1/tags/{id}
  Request:
    {
      "product_id": 1002,
      "tag_template_id": 6
    }

POST /api/v1/devices/{device_id}/tags/batch
  Request:
    {
      "tags": [
        {
          "grid_position": 0,
          "product_id": 1001,
          "tag_template_id": 5
        },
        {
          "grid_position": 1,
          "product_id": 1002,
          "tag_template_id": 5
        }
      ]
    }
```

### 5.7 제품 관리 API

```yaml
GET /api/v1/products
  Query Parameters:
    - include_descendants: boolean (하위 조직 상품 포함)
    - category: string
    - search: string

PUT /api/v1/products/{id}/price
  Request:
    {
      "current_price": 15000,
      "apply_to_descendants": true
    }
  Response:
    {
      "affected_tags": 25,
      "affected_devices": 10,
      "organizations": ["이마트 강남점", "이마트 서초점"]
    }

POST /api/v1/products/bulk-update
  Request:
    {
      "product_ids": [1001, 1002, 1003],
      "action": "price_change",
      "data": {
        "discount_rate": 0.2
      }
    }
```

### 5.8 WebSocket Events

```javascript
// 클라이언트 -> 서버
socket.emit('subscribe', { 
  room: 'organization',
  organizationId: 5,
  includeDescendants: true 
});

// 서버 -> 클라이언트  
socket.emit('device:status', {
  deviceId: 123,
  organizationPath: "1/3/5",
  status: 'online',
  template: {
    id: 1,
    name: "표준 2x2 그리드"
  }
});

socket.emit('tag:update', {
  tagId: 456,
  deviceId: 123,
  gridPosition: 0,
  status: 'completed',
  product: {
    name: "서울우유 1L",
    current_price: 3500
  }
});

socket.emit('template:change', {
  type: 'device_template',
  templateId: 2,
  affectedDevices: 15,
  status: 'in_progress'
});

socket.emit('organization:alert', {
  organizationId: 5,
  type: 'device_offline',
  count: 3,
  message: "3개 디바이스가 오프라인 상태입니다"
});

socket.emit('organization:location_update', {
  organizationId: 5,
  old_location: {
    latitude: 37.5063,
    longitude: 127.0539
  },
  new_location: {
    latitude: 37.5065,
    longitude: 127.0541
  },
  updated_by: "admin@example.com"
});
```

## 6. 비기능적 요구사항

### 6.1 성능 요구사항

**응답 시간**:

- API 응답: 평균 200ms 이하, 95 percentile 500ms 이하
- 디바이스 업데이트: 명령 전송 후 5초 이내 완료
- 템플릿 렌더링: 1초 이내
- 대시보드 로딩: 2초 이내
- 실시간 상태 업데이트: 5초 주기

**처리량**:

- 동시 사용자: 100명 이상
- 디바이스 관리: 10,000개 이상
- 일일 가격 업데이트: 100,000건 이상
- 템플릿 렌더링: 분당 1,000건 이상
- WebSocket 동시 연결: 1,000개 이상

**리소스 사용률**:

- CPU 사용률: 평균 50% 이하
- 메모리 사용률: 70% 이하
- 템플릿 캐시 히트율: 90% 이상
- 데이터베이스 연결 풀: 최대 100개

### 6.2 보안 요구사항

**인증 및 권한**:

- JWT 기반 토큰 인증 (유효기간 24시간)
- Refresh Token (유효기간 7일)
- Role-Based Access Control (RBAC)
- 템플릿 수정 권한 분리
- Multi-Factor Authentication (V2.0)

**데이터 보호**:

- HTTPS 필수 (TLS 1.3)
- 비밀번호 bcrypt 해싱 (round 12)
- PII 데이터 암호화 (AES-256)
- 템플릿 무결성 검증
- SQL Injection 방지 (Prepared Statements)

**보안 감사**:

- 모든 API 호출 로깅
- 템플릿 변경 이력 추적
- 실패한 로그인 시도 추적
- IP 기반 접근 제한
- Rate Limiting (100 requests/minute)

### 6.3 확장성 요구사항

**수평적 확장**:

- Stateless 애플리케이션 설계
- Auto Scaling Group (2-6 인스턴스)
- Load Balancer 기반 트래픽 분산
- 템플릿 CDN 캐싱
- 데이터베이스 Read Replica

**수직적 확장**:

- 인스턴스 타입 변경 가능
- 데이터베이스 스토리지 자동 확장
- ElastiCache 노드 추가
- 템플릿 렌더링 서버 분리

**다중 테넌시**:

- Organization ID 기반 데이터 격리
- 테넌트별 템플릿 저장소
- 테넌트별 리소스 할당량
- 독립적인 백업/복구

### 6.4 가용성 및 신뢰성

**가용성 목표**: 99.9% (연간 다운타임 8.76시간 이하)

**장애 복구**:

- RTO (Recovery Time Objective): 1시간
- RPO (Recovery Point Objective): 15분
- 자동화된 백업 (일일)
- 템플릿 버전 관리
- Multi-AZ 데이터베이스 배포

**모니터링**:

- CloudWatch 메트릭 수집
- 템플릿 사용 통계
- 실시간 알림 (SNS)
- Application Performance Monitoring
- 에러 추적 (Sentry)

## 7. 개발 일정 및 마일스톤

### 7.1 전체 일정 (2025.07.14 ~ 2025.09.30)

```
스프린트 0 (7/14-7/18): 프로젝트 준비
├── 개발 환경 구성
├── AWS 인프라 셋업
├── 데이터베이스 설계 (템플릿 시스템 포함)
├── 지도 API 선정 및 연동 테스트
└── CI/CD 파이프라인 구축

스프린트 1-2 (7/21-8/1): 기반 구축
├── 계층적 조직 구조 구현
├── 조직 주소 관리 기능
├── 지도 표시 기본 기능
├── 계층 기반 인증/권한 시스템
├── 디바이스/태그 템플릿 테이블 구현
├── 기본 API 프레임워크
└── 프론트엔드 기본 구조

스프린트 3-4 (8/4-8/15): 템플릿 시스템
├── 디바이스 템플릿 관리 기능
├── 태그 템플릿 관리 기능
├── 템플릿 렌더링 엔진
├── 템플릿 미리보기 시스템
├── 지도 클러스터링 구현
└── 템플릿 버전 관리

스프린트 5-6 (8/18-8/29): 핵심 기능
├── 디바이스 등록/관리
├── 프라이스 태그 할당
├── POS 시스템 연동
├── 계층별 일괄 업데이트
├── 지도 기반 조직 관리
├── WebSocket 실시간 통신
└── 성능 최적화

스프린트 7 (9/1-9/12): 테스트 및 안정화
├── 통합 테스트
├── 부하 테스트 (10,000 디바이스)
├── 지도 성능 테스트
├── 템플릿 호환성 테스트
├── 보안 점검
└── 버그 수정

스프린트 8 (9/15-9/30): 배포 준비
├── 운영 환경 구축
├── 데이터 마이그레이션 도구
├── 사용자 교육 자료
└── 최종 배포
```

### 7.2 주요 마일스톤

**M1 (7/31)**: 기반 시스템 완성

- 계층적 조직 구조 완성
- 계층 기반 권한 시스템 구현
- 템플릿 데이터베이스 스키마 확정
- 기본 API 동작 확인

**M2 (8/15)**: 템플릿 시스템 구현

- 디바이스 템플릿 CRUD 완성
- 태그 템플릿 CRUD 완성
- 템플릿 렌더링 엔진 구현
- 미리보기 시스템 동작

**M3 (8/29)**: 핵심 기능 완료

- 템플릿 기반 태그 할당
- 계층별 일괄 업데이트 구현
- POS 연동 테스트 완료
- 성능 목표 달성

**M4 (9/30)**: 운영 준비 완료

- 전체 시스템 안정화
- 운영 환경 배포
- 사용자 교육 완료
- Go-Live

### 7.3 팀 구성 및 역할

```
프로젝트 매니저 (1명)
├── 일정 관리
├── 이해관계자 소통
└── 리스크 관리

백엔드 개발자 (2명)
├── 계층 구조 API 개발
├── 템플릿 시스템 구현
├── 디바이스 통신 프로토콜
└── 시스템 통합

프론트엔드 개발자 (2명)
├── 템플릿 에디터 UI
├── 디바이스 관리 UI
├── 실시간 대시보드
└── 반응형 디자인

DevOps 엔지니어 (1명)
├── 인프라 구축
├── CI/CD 관리
├── 성능 모니터링
└── 보안 설정

QA 엔지니어 (1명)
├── 테스트 계획
├── 자동화 테스트
├── 부하 테스트
└── 품질 보증
```

## 8. 리스크 관리 계획

### 8.1 기술적 리스크

**리스크 1: 템플릿 시스템 복잡성**

- **확률**: 높음
- **영향**: 심각
- **완화 방안**:
    - 디바이스/태그 템플릿 명확한 분리
    - 템플릿 호환성 검증 시스템
    - 기본 템플릿 세트 제공
    - 단계별 템플릿 기능 출시

**리스크 2: 템플릿 렌더링 성능**

- **확률**: 중간
- **영향**: 높음
- **완화 방안**:
    - 템플릿 캐싱 전략
    - CDN 활용
    - 렌더링 서버 분리
    - 미리보기 이미지 사전 생성

**리스크 3: 템플릿 마이그레이션**

- **확률**: 높음
- **영향**: 중간
- **완화 방안**:
    - 템플릿 버전 관리
    - 호환성 매트릭스 관리
    - 자동 마이그레이션 도구
    - 롤백 메커니즘

**리스크 4: 대규모 템플릿 변경**

- **확률**: 중간
- **영향**: 높음
- **완화 방안**:
    - 영향도 사전 분석
    - 단계별 롤아웃
    - 테스트 환경 검증
    - 실시간 모니터링

**리스크 5: 계층 구조 성능 저하**

- **확률**: 중간
- **영향**: 높음
- **완화 방안**:
    - 계층 경로 캐싱 (path 컬럼)
    - 재귀 쿼리 최적화
    - 읽기 전용 뷰 생성
    - 계층 깊이 제한 (5단계)

### 8.2 프로젝트 관리 리스크

**리스크 6: 짧은 개발 기간 (2.5개월)**

- **확률**: 매우 높음
- **영향**: 높음
- **완화 방안**:
    - MVP 범위 엄격 관리
    - 핵심 기능 우선 개발
    - 병렬 개발 전략
    - 일일 스탠드업 미팅

**리스크 7: 복잡한 UI/UX 요구사항**

- **확률**: 높음
- **영향**: 중간
- **완화 방안**:
    - 템플릿 에디터 라이브러리 활용
    - 기본 템플릿 제공
    - 프로토타입 조기 검증
    - 사용자 피드백 반영

**리스크 8: 요구사항 변경**

- **확률**: 중간
- **영향**: 중간
- **완화 방안**:
    - 변경 관리 프로세스
    - 주간 스테이크홀더 리뷰
    - 우선순위 재조정
    - 버퍼 시간 확보

### 8.3 운영 리스크

**리스크 9: 데이터 마이그레이션**

- **확률**: 중간
- **영향**: 높음
- **완화 방안**:
    - 단계별 마이그레이션 계획
    - 템플릿 변환 도구
    - 테스트 환경 검증
    - 롤백 계획 수립

**리스크 10: 초기 운영 안정성**

- **확률**: 중간
- **영향**: 높음
- **완화 방안**:
    - 파일럿 매장 운영
    - 24/7 모니터링
    - 긴급 대응 체계
    - 단계별 확산

### 8.4 리스크 대응 매트릭스

|리스크|발생 시 대응|책임자|모니터링 주기|
|---|---|---|---|
|템플릿 복잡성|기본 템플릿만 제공|백엔드 리드|주간|
|렌더링 성능|캐시 서버 증설|DevOps|일일|
|템플릿 마이그레이션|수동 변환 지원|백엔드 리드|일일|
|대규모 변경|변경 중단, 분할 적용|PM|실시간|
|계층 성능|캐시 갱신, 쿼리 튜닝|DB 엔지니어|일일|
|일정 지연|기능 단계별 출시|PM|일일|
|UI 복잡성|기본 에디터만 제공|프론트엔드 리드|주간|
|요구사항 변경|영향도 분석|PM|주간|
|마이그레이션|소규모 테스트|DB 엔지니어|일일|
|운영 이슈|긴급 패치|DevOps|실시간|

### 8.5 리스크 완화 우선순위

1. **즉시 대응 필요**:
    
    - 템플릿 시스템 설계
    - 성능 최적화 전략
    - 개발 일정 관리
2. **조기 준비 필요**:
    
    - 템플릿 에디터 프로토타입
    - 렌더링 성능 테스트
    - 마이그레이션 도구
3. **지속적 모니터링**:
    
    - 요구사항 변경 추적
    - 팀 리소스 상태
    - 기술 부채 관리

## 9. 성공 지표 (KPI)

### 9.1 기술적 지표

- API 응답 시간: < 200ms (95%)
- 템플릿 렌더링 시간: < 1초
- 시스템 가용성: > 99.9%
- 디바이스 업데이트 성공률: > 95%
- 동시 처리 가능 디바이스: > 10,000개

### 9.2 비즈니스 지표

- 가격 업데이트 시간 단축: 수동 대비 90% 감소
- 템플릿 재사용률: > 80%
- 운영 비용 절감: 30% 이상
- 사용자 만족도: 4.0/5.0 이상
- 시스템 도입 후 오류율: < 1%

## 10. 부록

### 10.1 기술 스택 상세 버전

- React.js: 18.2.0
- Node.js: 18.17.0 LTS
- PostgreSQL: 14.9
- Redis: 7.0.12
- Nginx: 1.24.0
- Docker: 24.0.5
- Kubernetes: 1.27.3

### 10.2 참고 자료

- ESL 통신 프로토콜 문서
- AWS IoT 베스트 프랙티스
- POS 시스템 API 문서
- UI/UX 디자인 가이드라인
- 템플릿 엔진 설계 패턴

---

**문서 버전**: 1.1  
**작성일**: 2025년 7월 15일  
**수정 내용**: 디바이스 템플릿과 태그 템플릿 분리 설계 추가  
**다음 검토일**: 2025년 7월 22일