# 차세대 LCD ESL 데이터베이스 스키마 상세 설명서 (수정본)

## 1. 개요

이 문서는 차세대 LCD ESL 웹 CMS의 핵심 데이터베이스 테이블 구조에 대한 상세 설명을 담고 있습니다. 주요 변경사항으로 디바이스 템플릿과 태그 템플릿을 분리하여 더 유연한 레이아웃 관리가 가능하도록 설계되었습니다.

### 1.1 주요 변경사항

- **디바이스 템플릿 시스템**: 디바이스의 화면 분할 레이아웃을 관리하는 별도 템플릿
- **태그 템플릿 시스템**: 개별 가격표의 디자인을 관리하는 템플릿
- **유연한 그리드 시스템**: 다양한 크기의 태그를 조합할 수 있는 레이아웃
- **템플릿 호환성 관리**: 디바이스 템플릿과 태그 템플릿 간 호환성 검증

---

## 2. 테이블별 상세 설명

### 2.1 organizations (계층적 조직 관리)

**테이블 목적**: 멀티테넌트 SaaS 환경에서 계층적 조직 구조를 지원하여 본사-지점-매장 등의 복잡한 조직 체계를 관리합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 조직의 고유 식별자<br>• 자동 증가 정수값|
|**parent_id**|INTEGER|REFERENCES organizations(id)|• 상위 조직 참조<br>• NULL: 최상위 조직 (예: E-mart 본사)<br>• 계층 구조의 핵심<br>• 순환 참조 방지 필요|
|**name**|VARCHAR(255)|NOT NULL|• 조직/회사명<br>• 예: "이마트", "이마트 강남점", "이마트 강남점 식품관"<br>• 전체 경로명은 별도 생성|
|**type**|VARCHAR(50)|NOT NULL|• 조직 레벨 타입<br>• 'headquarters': 본사<br>• 'branch': 지점<br>• 'store': 개별 매장<br>• 권한 및 기능 제한 기준|
|**level**|INTEGER|NOT NULL DEFAULT 0|• 계층 깊이<br>• 0: 최상위 조직<br>• 1: 직속 하위 조직<br>• 쿼리 최적화용 캐시|
|**path**|VARCHAR(500)||• 계층 경로<br>• 예: "1/5/12" (조직ID 경로)<br>• 하위 조직 빠른 조회용<br>• 트리거로 자동 관리|
|**address**|VARCHAR(500)||• 도로명 주소<br>• 예: "서울시 강남구 영동대로 502"<br>• 지도 표시용 기본 주소|
|**address_detail**|VARCHAR(255)||• 상세 주소<br>• 층수, 호수 등<br>• 예: "지하 1층"|
|**postal_code**|VARCHAR(10)||• 우편번호<br>• 5자리 새 우편번호 체계|
|**city**|VARCHAR(100)||• 시/도<br>• 예: "서울시", "경기도"<br>• 지역별 필터링용|
|**district**|VARCHAR(100)||• 구/군<br>• 예: "강남구", "수원시"<br>• 세부 지역 구분|
|**latitude**|DECIMAL(10,8)||• 위도<br>• -90 ~ 90 범위<br>• 지도 마커 표시용<br>• 소수점 8자리 정밀도|
|**longitude**|DECIMAL(11,8)||• 경도<br>• -180 ~ 180 범위<br>• 지도 마커 표시용<br>• 소수점 8자리 정밀도|
|**phone**|VARCHAR(20)||• 대표 전화번호<br>• 국가코드 포함 가능<br>• 예: "02-3486-9000"|
|**business_hours**|JSONB||• 영업시간 정보<br>• 요일별/특별일 설정<br>• 예: {"weekday": "10:00-22:00", "weekend": "10:00-23:00"}|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 조직 등록 일시|
|**updated_at**|TIMESTAMP|DEFAULT NOW()|• 마지막 정보 수정 일시|

**비즈니스 규칙**:

- 상위 조직 삭제 시 하위 조직 처리 정책 필요
- 최대 계층 깊이 제한 고려 (예: 5단계)
- 조직 이동 시 path 재계산 필요
- 순환 참조 검증 로직 필수
- 주소 변경 시 지오코딩을 통한 좌표 자동 업데이트
- 본사(headquarters)는 주소 필수, 가상 조직(branch)은 선택적

---

### 2.2 users (계층적 권한을 가진 사용자 관리)

**테이블 목적**: 조직 계층 구조에 맞춘 권한 시스템을 지원하는 사용자 관리입니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 사용자 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 소속 조직<br>• 권한 범위 결정 기준<br>• 상위 조직 소속 시 하위 조직 접근 가능|
|**email**|VARCHAR(255)|UNIQUE, NOT NULL|• 로그인 ID<br>• 전체 시스템에서 유일|
|**password_hash**|VARCHAR(255)|NOT NULL|• bcrypt 해싱된 비밀번호|
|**full_name**|VARCHAR(255)|NOT NULL|• 사용자 실명|
|**role**|VARCHAR(50)|NOT NULL|• 'super_admin': 전체 시스템 관리<br>• 'org_admin': 조직 및 하위 조직 관리<br>• 'manager': 소속 조직 내 제품/가격 관리<br>• 'operator': 소속 조직 내 조회/기본 작업|
|**is_active**|BOOLEAN|DEFAULT true|• 계정 활성화 상태|
|**last_login**|TIMESTAMP|NULL 허용|• 마지막 로그인 시간|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 계정 생성 일시|

**권한 규칙**:

- 상위 조직 사용자는 모든 하위 조직 데이터 조회/관리 가능
- 하위 조직 사용자는 자신의 조직 데이터만 접근
- org_admin은 하위 조직 사용자 생성 가능
- 교차 조직 접근은 불가

---

### 2.3 device_templates (디바이스 템플릿 관리) - 신규 테이블

**테이블 목적**: ESL 디바이스의 화면을 효율적으로 분할하여 여러 상품을 표시할 수 있는 레이아웃 템플릿을 관리합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 템플릿 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 템플릿 소유 조직<br>• 하위 조직에서도 사용 가능|
|**name**|VARCHAR(255)|NOT NULL|• 템플릿 이름<br>• 예: "표준 2x2 그리드", "프로모션 3열"|
|**device_type**|VARCHAR(20)|NOT NULL|• 적용 디바이스 타입<br>• '23inch' 또는 '29inch'|
|**layout_type**|VARCHAR(50)|NOT NULL|• 레이아웃 유형<br>• 'grid_2x2': 2x2 그리드<br>• 'grid_1x4': 1x4 그리드<br>• 'grid_2x3': 2x3 그리드<br>• 'custom': 사용자 정의|
|**max_tags**|INTEGER|NOT NULL|• 최대 표시 가능 태그 수<br>• 23inch: 1-6개<br>• 29inch: 1-12개|
|**grid_config**|JSONB|NOT NULL|• 그리드 레이아웃 설정<br>• 행/열 수, 간격, 여백<br>• 각 셀의 크기와 위치|
|**preview_url**|VARCHAR(500)||• 템플릿 미리보기 이미지 URL|
|**is_default**|BOOLEAN|DEFAULT false|• 기본 템플릿 여부<br>• 디바이스 타입별 1개만 true|
|**created_by**|INTEGER|REFERENCES users(id)|• 템플릿 생성자|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 생성 일시|
|**updated_at**|TIMESTAMP|DEFAULT NOW()|• 수정 일시|

**비즈니스 규칙**:

- 디바이스 타입별 최대 태그 수 제한
- 그리드 셀의 총 면적은 화면 크기 초과 불가
- 기본 템플릿은 삭제 불가
- 사용 중인 템플릿은 major 변경 제한

---

### 2.4 esl_devices (디바이스 관리) - 수정됨

**테이블 목적**: ESL 디바이스의 물리적 정보와 적용된 디바이스 템플릿을 관리합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 디바이스 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 디바이스 소유 조직|
|**device_template_id**|INTEGER|REFERENCES device_templates(id)|• 적용된 디바이스 템플릿<br>• 화면 레이아웃 결정<br>• NULL: 기본 템플릿 사용|
|**mac_address**|VARCHAR(17)|UNIQUE, NOT NULL|• 디바이스 MAC 주소<br>• 형식: "AA:BB:CC:DD:EE:FF"|
|**device_type**|VARCHAR(20)|NOT NULL|• '23inch' 또는 '29inch'<br>• 템플릿 호환성 검증용|
|**firmware_version**|VARCHAR(50)||• 펌웨어 버전|
|**location_store**|VARCHAR(255)||• 설치 매장명|
|**location_aisle**|VARCHAR(50)||• 매장 내 통로/구역|
|**location_shelf**|VARCHAR(50)||• 선반 위치|
|**battery_level**|INTEGER||• 배터리 잔량 (%)|
|**signal_strength**|INTEGER||• WiFi 신호 강도|
|**status**|VARCHAR(20)|DEFAULT 'active'|• 디바이스 상태<br>• 'active': 정상<br>• 'inactive': 비활성<br>• 'error': 오류|
|**last_heartbeat**|TIMESTAMP||• 마지막 통신 시간|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 디바이스 등록 일시|
|**updated_at**|TIMESTAMP|DEFAULT NOW()|• 정보 수정 일시|

**비즈니스 규칙**:

- device_type과 device_template의 device_type 일치 필요
- 템플릿 변경 시 기존 태그 마이그레이션 필요
- 오프라인 디바이스는 템플릿 변경 제한

---

### 2.5 tag_templates (태그 템플릿 관리) - 신규 테이블

**테이블 목적**: 개별 가격표의 디자인과 레이아웃을 정의하는 템플릿을 관리합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 템플릿 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 템플릿 소유 조직|
|**name**|VARCHAR(255)|NOT NULL|• 템플릿 이름<br>• 예: "기본 가격표", "할인 강조형"|
|**template_type**|VARCHAR(50)|NOT NULL|• 템플릿 용도<br>• 'price_tag': 일반 가격표<br>• 'promotion': 프로모션<br>• 'info': 정보 표시<br>• 'custom': 사용자 정의|
|**size_type**|VARCHAR(20)|NOT NULL|• 크기 유형<br>• 'small': 소형<br>• 'medium': 중형<br>• 'large': 대형<br>• 'flexible': 유동적|
|**min_width**|INTEGER|NOT NULL|• 최소 너비 (픽셀)<br>• 그리드 셀에 맞춤 시 참조|
|**min_height**|INTEGER|NOT NULL|• 최소 높이 (픽셀)<br>• 그리드 셀에 맞춤 시 참조|
|**aspect_ratio**|VARCHAR(20)||• 종횡비<br>• '1:1', '4:3', '16:9'<br>• 'flexible': 자유 비율|
|**layout_config**|JSONB|NOT NULL|• 템플릿 레이아웃 설정<br>• 요소 위치, 스타일<br>• 데이터 바인딩 정보|
|**preview_url**|VARCHAR(500)||• 템플릿 미리보기 URL|
|**category**|VARCHAR(100)||• 적용 상품 카테고리<br>• 자동 템플릿 선택용|
|**is_default**|BOOLEAN|DEFAULT false|• 기본 템플릿 여부<br>• 템플릿 타입별 1개|
|**created_by**|INTEGER|REFERENCES users(id)|• 템플릿 생성자|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 생성 일시|
|**updated_at**|TIMESTAMP|DEFAULT NOW()|• 수정 일시|

**비즈니스 규칙**:

- 반응형 디자인을 위한 최소 크기 보장
- 템플릿 타입별 필수 요소 검증
- 데이터 바인딩 유효성 검사
- 카테고리별 자동 적용 규칙

---

### 2.6 price_tags (프라이스 태그 관리) - 수정됨

**테이블 목적**: 디바이스의 각 그리드 위치에 할당된 상품과 적용된 태그 템플릿을 관리합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 태그 고유 식별자|
|**device_id**|INTEGER|REFERENCES esl_devices(id) ON DELETE CASCADE|• 소속 디바이스<br>• 디바이스 삭제 시 태그도 삭제|
|**product_id**|INTEGER|REFERENCES products(id) ON DELETE SET NULL|• 표시할 상품<br>• NULL: 빈 태그<br>• 상품 삭제 시 NULL 처리|
|**tag_template_id**|INTEGER|REFERENCES tag_templates(id)|• 적용된 태그 템플릿<br>• 태그의 디자인 결정|
|**grid_position**|INTEGER|NOT NULL|• 그리드 내 위치<br>• 0부터 시작<br>• 왼쪽 위부터 순서대로|
|**grid_width**|INTEGER|DEFAULT 1|• 차지하는 그리드 너비<br>• colspan 개념<br>• 1: 기본 크기|
|**grid_height**|INTEGER|DEFAULT 1|• 차지하는 그리드 높이<br>• rowspan 개념<br>• 1: 기본 크기|
|**custom_position**|JSONB||• 커스텀 레이아웃용<br>• x, y, width, height<br>• 픽셀 단위 절대 위치|
|**is_active**|BOOLEAN|DEFAULT true|• 태그 활성화 상태<br>• false: 화면에서 숨김|
|**display_order**|INTEGER|NOT NULL|• 표시 순서<br>• 같은 위치 내 우선순위|
|**last_updated**|TIMESTAMP|DEFAULT NOW()|• 마지막 업데이트 시간|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 태그 생성 일시|
|**UNIQUE**|(device_id, grid_position)|복합 유니크|• 디바이스별 위치 중복 방지|

**비즈니스 규칙**:

- grid_position은 device_template의 max_tags 미만
- grid_width/height는 그리드 경계 초과 불가
- 태그 템플릿과 그리드 크기 호환성 검증
- 겹치는 태그 위치 방지

---

### 2.7 products (상품 정보)

**테이블 목적**: 변경사항 없음. 기존과 동일하게 상품 정보를 관리하며, price_tags를 통해 디바이스와 연결됩니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 상품 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 상품 소유 조직|
|**sku**|VARCHAR(100)|NOT NULL|• 재고 관리 단위|
|**barcode**|VARCHAR(100)||• 바코드 번호|
|**name**|VARCHAR(255)|NOT NULL|• 상품명|
|**description**|TEXT||• 상품 설명|
|**category**|VARCHAR(100)||• 상품 카테고리|
|**current_price**|DECIMAL(10,2)|NOT NULL|• 현재 판매가|
|**original_price**|DECIMAL(10,2)||• 정가|
|**currency**|VARCHAR(3)|DEFAULT 'KRW'|• 통화 단위|
|**unit**|VARCHAR(50)||• 판매 단위|
|**stock_level**|INTEGER|DEFAULT 0|• 재고 수량|
|**is_promotion**|BOOLEAN|DEFAULT false|• 프로모션 여부|
|**promotion_end_date**|TIMESTAMP||• 프로모션 종료일|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 등록 일시|
|**updated_at**|TIMESTAMP|DEFAULT NOW()|• 수정 일시|
|**UNIQUE**|(organization_id, sku)|복합 유니크|• 조직별 SKU 유일성|

---

### 2.8 content_updates (콘텐츠 업데이트 기록) - 수정됨

**테이블 목적**: 디바이스, 태그, 템플릿 변경에 대한 모든 업데이트를 추적합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 업데이트 고유 식별자|
|**device_id**|INTEGER|REFERENCES esl_devices(id)|• 대상 디바이스|
|**price_tag_id**|INTEGER|REFERENCES price_tags(id)|• 대상 프라이스 태그<br>• NULL: 전체 디바이스 업데이트|
|**product_id**|INTEGER|REFERENCES products(id)|• 관련 상품|
|**tag_template_id**|INTEGER|REFERENCES tag_templates(id)|• 적용된 태그 템플릿|
|**update_type**|VARCHAR(50)||• 업데이트 유형<br>• 'price': 가격 변경<br>• 'template': 템플릿 변경<br>• 'full': 전체 업데이트<br>• 'layout': 레이아웃 변경<br>• 'device_template': 디바이스 템플릿 변경|
|**status**|VARCHAR(20)||• 업데이트 상태<br>• 'pending': 대기중<br>• 'in_progress': 진행중<br>• 'completed': 완료<br>• 'failed': 실패|
|**retry_count**|INTEGER|DEFAULT 0|• 재시도 횟수|
|**error_message**|TEXT||• 오류 메시지|
|**created_by**|INTEGER|REFERENCES users(id)|• 업데이트 요청자|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 요청 시간|
|**completed_at**|TIMESTAMP||• 완료 시간|

---

### 2.9 system_logs (시스템 로그)

**테이블 목적**: 변경사항 없음. 시스템의 모든 주요 활동을 기록합니다.

|컬럼명|데이터 타입|제약조건|설명|
|---|---|---|---|
|**id**|SERIAL|PRIMARY KEY|• 로그 고유 식별자|
|**organization_id**|INTEGER|REFERENCES organizations(id)|• 활동 조직|
|**user_id**|INTEGER|REFERENCES users(id)|• 활동 사용자|
|**action**|VARCHAR(100)|NOT NULL|• 수행 작업|
|**entity_type**|VARCHAR(50)||• 대상 엔티티 타입|
|**entity_id**|INTEGER||• 대상 엔티티 ID|
|**ip_address**|INET||• 요청 IP 주소|
|**user_agent**|TEXT||• 브라우저 정보|
|**details**|JSONB||• 상세 정보|
|**created_at**|TIMESTAMP|DEFAULT NOW()|• 로그 생성 시간|

---

## 3. 인덱스 전략

### 3.1 성능 최적화 인덱스

```sql
-- 조직 계층 구조 탐색
CREATE INDEX idx_organizations_parent ON organizations(parent_id);
CREATE INDEX idx_organizations_path ON organizations(path);

-- 지도 표시를 위한 지리적 인덱스
CREATE INDEX idx_organizations_location ON organizations(latitude, longitude);
CREATE INDEX idx_organizations_city_district ON organizations(city, district);

-- 디바이스 관리
CREATE INDEX idx_devices_org_status ON esl_devices(organization_id, status);
CREATE INDEX idx_devices_template ON esl_devices(device_template_id);
CREATE INDEX idx_devices_heartbeat ON esl_devices(last_heartbeat);

-- 태그 관리
CREATE INDEX idx_price_tags_device ON price_tags(device_id, is_active);
CREATE INDEX idx_price_tags_product ON price_tags(product_id);
CREATE INDEX idx_price_tags_template ON price_tags(tag_template_id);

-- 상품 검색
CREATE INDEX idx_products_org_sku ON products(organization_id, sku);
CREATE INDEX idx_products_category ON products(organization_id, category);

-- 업데이트 추적
CREATE INDEX idx_updates_device_status ON content_updates(device_id, status);
CREATE INDEX idx_updates_price_tag ON content_updates(price_tag_id, status);
CREATE INDEX idx_updates_created ON content_updates(created_at DESC);

-- 로그 조회
CREATE INDEX idx_logs_org_created ON system_logs(organization_id, created_at DESC);
CREATE INDEX idx_logs_user_created ON system_logs(user_id, created_at DESC);
```

---

## 4. 트리거 및 함수

### 4.1 조직 경로 자동 관리

```sql
CREATE OR REPLACE FUNCTION update_organization_path() 
RETURNS TRIGGER AS $
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path = NEW.id::text;
        NEW.level = 0;
    ELSE
        SELECT path || '/' || NEW.id::text, level + 1
        INTO NEW.path, NEW.level
        FROM organizations 
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_org_path 
BEFORE INSERT OR UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_organization_path();
```

### 4.2 템플릿 호환성 검증

```sql
CREATE OR REPLACE FUNCTION validate_template_compatibility() 
RETURNS TRIGGER AS $
DECLARE
    device_type VARCHAR(20);
    template_device_type VARCHAR(20);
BEGIN
    -- 디바이스 템플릿 호환성 검증
    IF TG_TABLE_NAME = 'esl_devices' AND NEW.device_template_id IS NOT NULL THEN
        SELECT dt.device_type INTO template_device_type
        FROM device_templates dt
        WHERE dt.id = NEW.device_template_id;
        
        IF template_device_type != NEW.device_type THEN
            RAISE EXCEPTION 'Device template % is not compatible with device type %', 
                NEW.device_template_id, NEW.device_type;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_device_template 
BEFORE INSERT OR UPDATE ON esl_devices
FOR EACH ROW EXECUTE FUNCTION validate_template_compatibility();
```

### 4.3 태그 위치 충돌 방지

```sql
CREATE OR REPLACE FUNCTION validate_tag_position() 
RETURNS TRIGGER AS $
DECLARE
    max_position INTEGER;
    conflict_count INTEGER;
BEGIN
    -- 디바이스 템플릿의 최대 태그 수 확인
    SELECT dt.max_tags INTO max_position
    FROM esl_devices d
    JOIN device_templates dt ON d.device_template_id = dt.id
    WHERE d.id = NEW.device_id;
    
    IF NEW.grid_position >= max_position THEN
        RAISE EXCEPTION 'Grid position % exceeds maximum tags %', 
            NEW.grid_position, max_position;
    END IF;
    
    -- 위치 충돌 확인 (colspan/rowspan 고려)
    -- 복잡한 로직이므로 실제 구현 시 상세 설계 필요
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_tag_position 
BEFORE INSERT OR UPDATE ON price_tags
FOR EACH ROW EXECUTE FUNCTION validate_tag_position();
```

---

## 5. 쿼리 예시

### 5.1 디바이스와 템플릿 정보 조회

```sql
-- 특정 조직의 모든 디바이스와 템플릿 정보
SELECT 
    d.id,
    d.mac_address,
    d.device_type,
    dt.name AS device_template_name,
    dt.layout_type,
    dt.max_tags,
    COUNT(pt.id) AS active_tags,
    o.name AS organization_name,
    o.address,
    o.latitude,
    o.longitude
FROM esl_devices d
LEFT JOIN device_templates dt ON d.device_template_id = dt.id
LEFT JOIN price_tags pt ON d.id = pt.device_id AND pt.is_active = true
LEFT JOIN organizations o ON d.organization_id = o.id
WHERE d.organization_id = :org_id
GROUP BY d.id, d.mac_address, d.device_type, dt.name, dt.layout_type, dt.max_tags, 
         o.name, o.address, o.latitude, o.longitude;
```

### 5.2 태그 템플릿 호환성 확인

```sql
-- 특정 디바이스 템플릿과 호환 가능한 태그 템플릿 조회
WITH device_grid AS (
    SELECT 
        dt.id,
        (dt.grid_config->>'grid_width')::INTEGER AS cell_width,
        (dt.grid_config->>'grid_height')::INTEGER AS cell_height
    FROM device_templates dt
    WHERE dt.id = :device_template_id
)
SELECT 
    tt.id,
    tt.name,
    tt.template_type,
    tt.size_type,
    CASE 
        WHEN tt.min_width <= dg.cell_width 
         AND tt.min_height <= dg.cell_height 
        THEN 'compatible'
        ELSE 'requires_scaling'
    END AS compatibility
FROM tag_templates tt
CROSS JOIN device_grid dg
WHERE tt.organization_id = :org_id
ORDER BY tt.template_type, tt.name;
```

### 5.3 템플릿 변경 영향도 분석

```sql
-- 디바이스 템플릿 변경 시 영향받는 태그 분석
SELECT 
    d.id AS device_id,
    d.mac_address,
    o.name AS organization_name,
    COUNT(pt.id) AS total_tags,
    COUNT(CASE WHEN pt.grid_position >= :new_max_tags THEN 1 END) AS affected_tags
FROM esl_devices d
JOIN organizations o ON d.organization_id = o.id
LEFT JOIN price_tags pt ON d.id = pt.device_id AND pt.is_active = true
WHERE d.device_template_id = :old_template_id
GROUP BY d.id, d.mac_address, o.name
HAVING COUNT(pt.id) > 0;
```

### 5.4 지도 표시를 위한 조직 정보 조회

```sql
-- 지도 영역 내 조직 조회 (바운딩 박스 기반)
SELECT 
    o.id,
    o.name,
    o.type,
    o.latitude,
    o.longitude,
    o.address,
    o.phone,
    o.business_hours,
    COUNT(DISTINCT d.id) AS total_devices,
    COUNT(DISTINCT CASE WHEN d.status = 'active' THEN d.id END) AS active_devices,
    COUNT(DISTINCT CASE WHEN d.status = 'error' THEN d.id END) AS error_devices
FROM organizations o
LEFT JOIN esl_devices d ON o.id = d.organization_id
WHERE o.latitude BETWEEN :sw_lat AND :ne_lat
  AND o.longitude BETWEEN :sw_lng AND :ne_lng
  AND o.latitude IS NOT NULL
  AND o.longitude IS NOT NULL
GROUP BY o.id;

-- 계층별 조직 위치 정보
WITH RECURSIVE org_hierarchy AS (
    SELECT 
        o.*,
        o.name AS full_path
    FROM organizations o
    WHERE o.id = :root_org_id
    
    UNION ALL
    
    SELECT 
        o.*,
        oh.full_path || ' > ' || o.name AS full_path
    FROM organizations o
    INNER JOIN org_hierarchy oh ON o.parent_id = oh.id
)
SELECT 
    id,
    name,
    type,
    latitude,
    longitude,
    address,
    full_path,
    level
FROM org_hierarchy
WHERE latitude IS NOT NULL
ORDER BY level, name;
```

---

## 6. 데이터 마이그레이션 고려사항

### 6.1 기존 시스템에서 마이그레이션

1. **디바이스 템플릿 생성**
    
    - 기존 레이아웃 분석
    - 표준 템플릿 세트 생성
    - 디바이스별 적절한 템플릿 매핑
2. **태그 템플릿 변환**
    
    - 기존 템플릿을 태그 템플릿으로 변환
    - 크기 정보 추출 및 설정
    - 반응형 설정 추가
3. **태그 위치 재계산**
    
    - 기존 태그 위치를 그리드 포지션으로 변환
    - 충돌 해결 및 최적화

### 6.2 템플릿 버전 관리

```sql
-- 템플릿 버전 관리 테이블 (선택적)
CREATE TABLE template_versions (
    id SERIAL PRIMARY KEY,
    template_type VARCHAR(50) NOT NULL, -- 'device' or 'tag'
    template_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    config_snapshot JSONB NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. 성능 최적화 전략

### 7.1 캐싱 전략

- 디바이스 템플릿: Redis에 24시간 캐싱
- 태그 템플릿: 자주 사용되는 템플릿 메모리 캐싱
- 렌더링된 템플릿: CDN 캐싱

### 7.2 쿼리 최적화

- 계층 구조 조회: Materialized View 활용
- 템플릿 호환성: 사전 계산된 매트릭스
- 대량 업데이트: 배치 처리

---

**문서 버전**: 1.1  
**작성일**: 2025년 7월 15일  
**수정 내용**: 디바이스 템플릿과 태그 템플릿 분리, 유연한 그리드 시스템 추가  
**다음 검토일**: 2025년 7월 22일