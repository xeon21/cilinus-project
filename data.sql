-- ===============================================
-- 차세대 LCD ESL 데이터베이스 SQL
-- 작성일: 2025-07-21
-- 버전: 1.0
-- ===============================================

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS esl_cms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE esl_cms_db;

-- ===============================================
-- 1. 테이블 생성
-- ===============================================

-- 1.1 organizations (계층적 조직 관리)
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'headquarters, branch, store',
    level INT NOT NULL DEFAULT 0,
    path VARCHAR(500),
    address VARCHAR(500),
    address_detail VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    district VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20),
    business_hours JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 1.2 users (사용자 기본 정보)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- 1.3 roles (역할 정의)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 permissions (권한 정의)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 user_roles (사용자-역할 매핑)
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    expires_at TIMESTAMP NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 1.6 role_permissions (역할-권한 매핑)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 1.7 user_permissions (사용자별 개별 권한)
CREATE TABLE user_permissions (
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted BOOLEAN DEFAULT true,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    expires_at TIMESTAMP NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 1.8 device_templates (디바이스 템플릿 관리)
CREATE TABLE device_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    name VARCHAR(255) NOT NULL,
    device_type VARCHAR(20) NOT NULL COMMENT '23inch or 29inch',
    layout_type VARCHAR(50) NOT NULL COMMENT 'grid_2x2, grid_1x4, grid_2x3, custom',
    max_tags INT NOT NULL,
    grid_config JSON NOT NULL,
    preview_url VARCHAR(500),
    is_default BOOLEAN DEFAULT false,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 1.9 esl_devices (디바이스 관리)
CREATE TABLE esl_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    device_template_id INT,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL COMMENT '23inch or 29inch',
    firmware_version VARCHAR(50),
    location_store VARCHAR(255),
    location_aisle VARCHAR(50),
    location_shelf VARCHAR(50),
    battery_level INT,
    signal_strength INT,
    status VARCHAR(20) DEFAULT 'active' COMMENT 'active, inactive, error',
    last_heartbeat TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (device_template_id) REFERENCES device_templates(id) ON DELETE SET NULL
);

-- 1.10 tag_templates (태그 템플릿 관리)
CREATE TABLE tag_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL COMMENT 'price_tag, promotion, info, custom',
    size_type VARCHAR(20) NOT NULL COMMENT 'small, medium, large, flexible',
    min_width INT NOT NULL,
    min_height INT NOT NULL,
    aspect_ratio VARCHAR(20),
    layout_config JSON NOT NULL,
    preview_url VARCHAR(500),
    category VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 1.11 products (상품 정보)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    current_price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'KRW',
    unit VARCHAR(50),
    stock_level INT DEFAULT 0,
    is_promotion BOOLEAN DEFAULT false,
    promotion_end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_org_sku (organization_id, sku),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 1.12 price_tags (프라이스 태그 관리)
CREATE TABLE price_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    product_id INT,
    tag_template_id INT,
    grid_position INT NOT NULL,
    grid_width INT DEFAULT 1,
    grid_height INT DEFAULT 1,
    custom_position JSON,
    is_active BOOLEAN DEFAULT true,
    display_order INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_device_position (device_id, grid_position),
    FOREIGN KEY (device_id) REFERENCES esl_devices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (tag_template_id) REFERENCES tag_templates(id) ON DELETE SET NULL
);

-- 1.13 content_updates (콘텐츠 업데이트 기록)
CREATE TABLE content_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    price_tag_id INT,
    product_id INT,
    tag_template_id INT,
    update_type VARCHAR(50) COMMENT 'price, template, full, layout, device_template',
    status VARCHAR(20) COMMENT 'pending, in_progress, completed, failed',
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (device_id) REFERENCES esl_devices(id) ON DELETE CASCADE,
    FOREIGN KEY (price_tag_id) REFERENCES price_tags(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_template_id) REFERENCES tag_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 1.14 system_logs (시스템 로그)
CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ===============================================
-- 2. 인덱스 생성
-- ===============================================

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

-- ===============================================
-- 3. 트리거 및 함수 생성
-- ===============================================

DELIMITER $$

-- 3.1 조직 경로 자동 관리 함수
CREATE FUNCTION update_organization_path(org_id INT, p_id INT) 
RETURNS VARCHAR(500)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE parent_path VARCHAR(500);
    DECLARE new_path VARCHAR(500);
    
    IF p_id IS NULL THEN
        RETURN CAST(org_id AS CHAR);
    ELSE
        SELECT path INTO parent_path FROM organizations WHERE id = p_id;
        SET new_path = CONCAT(parent_path, '/', CAST(org_id AS CHAR));
        RETURN new_path;
    END IF;
END$$

-- 조직 경로 업데이트 트리거
CREATE TRIGGER trigger_update_org_path 
BEFORE INSERT ON organizations
FOR EACH ROW
BEGIN
    SET NEW.path = update_organization_path(NEW.id, NEW.parent_id);
    IF NEW.parent_id IS NULL THEN
        SET NEW.level = 0;
    ELSE
        SELECT level + 1 INTO NEW.level FROM organizations WHERE id = NEW.parent_id;
    END IF;
END$$

-- 3.2 템플릿 호환성 검증 트리거
CREATE TRIGGER trigger_validate_device_template 
BEFORE INSERT ON esl_devices
FOR EACH ROW
BEGIN
    DECLARE template_device_type VARCHAR(20);
    
    IF NEW.device_template_id IS NOT NULL THEN
        SELECT device_type INTO template_device_type
        FROM device_templates 
        WHERE id = NEW.device_template_id;
        
        IF template_device_type != NEW.device_type THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Device template is not compatible with device type';
        END IF;
    END IF;
END$$

CREATE TRIGGER trigger_validate_device_template_update
BEFORE UPDATE ON esl_devices
FOR EACH ROW
BEGIN
    DECLARE template_device_type VARCHAR(20);
    
    IF NEW.device_template_id IS NOT NULL AND NEW.device_template_id != OLD.device_template_id THEN
        SELECT device_type INTO template_device_type
        FROM device_templates 
        WHERE id = NEW.device_template_id;
        
        IF template_device_type != NEW.device_type THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Device template is not compatible with device type';
        END IF;
    END IF;
END$$

-- 3.3 태그 위치 충돌 방지 트리거
CREATE TRIGGER trigger_validate_tag_position 
BEFORE INSERT ON price_tags
FOR EACH ROW
BEGIN
    DECLARE max_position INT;
    
    SELECT dt.max_tags INTO max_position
    FROM esl_devices d
    JOIN device_templates dt ON d.device_template_id = dt.id
    WHERE d.id = NEW.device_id;
    
    IF NEW.grid_position >= max_position THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Grid position exceeds maximum tags for device';
    END IF;
END$$

DELIMITER ;

-- ===============================================
-- 4. 기본 시스템 데이터 삽입
-- ===============================================

-- 4.1 시스템 역할 생성
INSERT INTO roles (name, display_name, description, is_system) VALUES
('super_admin', '최고 관리자', '전체 시스템 관리 권한', true),
('org_admin', '조직 관리자', '소속 조직 및 하위 조직 관리 권한', true),
('manager', '매니저', '제품 및 가격 관리 권한', true),
('operator', '운영자', '기본 운영 권한', true),
('viewer', '조회자', '읽기 전용 권한', true);

-- 4.2 시스템 권한 생성
-- 메뉴 접근 권한
INSERT INTO permissions (resource, action, name, description) VALUES
('menu.admin', 'view', 'menu.admin.view', '관리자 메뉴 접근'),
('menu.dashboard', 'view', 'menu.dashboard.view', '대시보드 메뉴 접근'),
('menu.user_management', 'view', 'menu.user_management.view', '사용자 관리 메뉴 접근'),
('menu.product', 'view', 'menu.product.view', '상품 메뉴 접근'),
('menu.report', 'view', 'menu.report.view', '리포트 메뉴 접근');

-- API 권한
INSERT INTO permissions (resource, action, name, description) VALUES
('api.users', 'create', 'api.users.create', '사용자 생성'),
('api.users', 'read', 'api.users.read', '사용자 조회'),
('api.users', 'update', 'api.users.update', '사용자 수정'),
('api.users', 'delete', 'api.users.delete', '사용자 삭제'),
('api.products', 'create', 'api.products.create', '상품 생성'),
('api.products', 'read', 'api.products.read', '상품 조회'),
('api.products', 'update', 'api.products.update', '상품 수정'),
('api.products', 'delete', 'api.products.delete', '상품 삭제'),
('api.reports', 'create', 'api.reports.create', '리포트 생성'),
('api.reports', 'read', 'api.reports.read', '리포트 조회');

-- 기능 권한
INSERT INTO permissions (resource, action, name, description) VALUES
('feature.export_data', 'execute', 'feature.export_data', '데이터 내보내기'),
('feature.bulk_import', 'execute', 'feature.bulk_import', '대량 데이터 가져오기'),
('feature.system_config', 'execute', 'feature.system_config', '시스템 설정 변경'),
('feature.audit_log', 'view', 'feature.audit_log', '감사 로그 조회');

-- 4.3 역할별 권한 매핑
-- super_admin은 모든 권한 보유
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- org_admin 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.user_management.view', 'menu.product.view', 'menu.report.view',
    'api.users.create', 'api.users.read', 'api.users.update',
    'api.products.create', 'api.products.read', 'api.products.update', 'api.products.delete',
    'api.reports.create', 'api.reports.read',
    'feature.export_data', 'feature.bulk_import'
);

-- manager 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.product.view', 'menu.report.view',
    'api.products.create', 'api.products.read', 'api.products.update',
    'api.reports.read',
    'feature.export_data'
);

-- operator 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.product.view',
    'api.products.read',
    'api.reports.read'
);

-- viewer 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view',
    'api.reports.read'
);

-- ===============================================
-- 5. 목업 데이터 생성
-- ===============================================

-- 5.1 조직 데이터
INSERT INTO organizations (id, parent_id, name, type, address, address_detail, postal_code, city, district, latitude, longitude, phone, business_hours) VALUES
(1, NULL, '이마트', 'headquarters', '서울시 성동구 뚝섬로 377', '이마트 본사', '04780', '서울시', '성동구', 37.5443, 127.0557, '02-380-5678', '{"weekday": "09:00-18:00", "weekend": "closed"}'),
(2, 1, '이마트 강남점', 'store', '서울시 강남구 영동대로 502', NULL, '06178', '서울시', '강남구', 37.5052, 127.0564, '02-3486-9000', '{"weekday": "10:00-22:00", "weekend": "10:00-23:00"}'),
(3, 1, '이마트 용산점', 'store', '서울시 용산구 한강대로23길 55', NULL, '04377', '서울시', '용산구', 37.5295, 126.9647, '02-6020-1234', '{"weekday": "10:00-22:00", "weekend": "10:00-23:00"}'),
(4, 1, '이마트 성수점', 'store', '서울시 성동구 왕십리로 83-21', NULL, '04780', '서울시', '성동구', 37.5443, 127.0557, '02-380-5678', '{"weekday": "10:00-22:00", "weekend": "10:00-23:00"}'),
(5, 2, '이마트 강남점 식품관', 'branch', '서울시 강남구 영동대로 502', '지하 1층', '06178', '서울시', '강남구', 37.5052, 127.0564, '02-3486-9001', '{"weekday": "10:00-22:00", "weekend": "10:00-23:00"}'),
(6, 2, '이마트 강남점 생활관', 'branch', '서울시 강남구 영동대로 502', '2층', '06178', '서울시', '강남구', 37.5052, 127.0564, '02-3486-9002', '{"weekday": "10:00-22:00", "weekend": "10:00-23:00"}');

-- 수동으로 path 업데이트 (트리거가 작동하지 않을 경우)
UPDATE organizations SET path = '1' WHERE id = 1;
UPDATE organizations SET path = '1/2' WHERE id = 2;
UPDATE organizations SET path = '1/3' WHERE id = 3;
UPDATE organizations SET path = '1/4' WHERE id = 4;
UPDATE organizations SET path = '1/2/5' WHERE id = 5;
UPDATE organizations SET path = '1/2/6' WHERE id = 6;

-- 5.2 사용자 데이터
INSERT INTO users (organization_id, email, password_hash, full_name, is_active) VALUES
(1, 'admin@emart.com', '$2b$10$YourHashedPasswordHere1', '최고관리자', true),
(2, 'gangnam.admin@emart.com', '$2b$10$YourHashedPasswordHere2', '강남점 관리자', true),
(3, 'yongsan.admin@emart.com', '$2b$10$YourHashedPasswordHere3', '용산점 관리자', true),
(5, 'food.manager@emart.com', '$2b$10$YourHashedPasswordHere4', '식품관 매니저', true),
(6, 'life.manager@emart.com', '$2b$10$YourHashedPasswordHere5', '생활관 매니저', true),
(2, 'operator1@emart.com', '$2b$10$YourHashedPasswordHere6', '운영자1', true),
(2, 'viewer1@emart.com', '$2b$10$YourHashedPasswordHere7', '조회자1', true);

-- 5.3 사용자 역할 매핑
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
(1, 1, NULL), -- 최고관리자 -> super_admin
(2, 2, 1),    -- 강남점 관리자 -> org_admin
(3, 2, 1),    -- 용산점 관리자 -> org_admin 
(4, 3, 2),    -- 식품관 매니저 -> manager
(5, 3, 2),    -- 생활관 매니저 -> manager
(6, 4, 2),    -- 운영자1 -> operator
(7, 5, 2);    -- 조회자1 -> viewer

-- 5.4 디바이스 템플릿 데이터
INSERT INTO device_templates (organization_id, name, device_type, layout_type, max_tags, grid_config, is_default, created_by) VALUES
(1, '표준 2x2 그리드 (23인치)', '23inch', 'grid_2x2', 4, '{"rows": 2, "cols": 2, "gap": 10, "padding": 20, "grid_width": 480, "grid_height": 400}', true, 1),
(1, '1x4 세로형 (23인치)', '23inch', 'grid_1x4', 4, '{"rows": 4, "cols": 1, "gap": 5, "padding": 15, "grid_width": 480, "grid_height": 400}', false, 1),
(1, '표준 2x3 그리드 (29인치)', '29inch', 'grid_2x3', 6, '{"rows": 2, "cols": 3, "gap": 10, "padding": 20, "grid_width": 720, "grid_height": 480}', true, 1),
(1, '3x4 대형 그리드 (29인치)', '29inch', 'grid_3x4', 12, '{"rows": 3, "cols": 4, "gap": 8, "padding": 15, "grid_width": 720, "grid_height": 480}', false, 1);

-- 5.5 ESL 디바이스 데이터
INSERT INTO esl_devices (organization_id, device_template_id, mac_address, device_type, firmware_version, location_store, location_aisle, location_shelf, battery_level, signal_strength, status) VALUES
(2, 1, 'AA:BB:CC:DD:EE:01', '23inch', 'v2.1.0', '강남점', '식품-A', 'A-1', 85, -45, 'active'),
(2, 1, 'AA:BB:CC:DD:EE:02', '23inch', 'v2.1.0', '강남점', '식품-A', 'A-2', 92, -42, 'active'),
(2, 3, 'AA:BB:CC:DD:EE:03', '29inch', 'v2.1.0', '강남점', '식품-B', 'B-1', 78, -48, 'active'),
(2, 3, 'AA:BB:CC:DD:EE:04', '29inch', 'v2.1.0', '강남점', '식품-B', 'B-2', 65, -52, 'active'),
(3, 1, 'AA:BB:CC:DD:EE:05', '23inch', 'v2.0.8', '용산점', '생활-A', 'A-1', 45, -58, 'active'),
(3, 2, 'AA:BB:CC:DD:EE:06', '23inch', 'v2.0.8', '용산점', '생활-A', 'A-3', 30, -62, 'error'),
(5, 1, 'AA:BB:CC:DD:EE:07', '23inch', 'v2.1.0', '강남점 식품관', '과일', '1-A', 88, -40, 'active'),
(5, 3, 'AA:BB:CC:DD:EE:08', '29inch', 'v2.1.0', '강남점 식품관', '채소', '2-A', 76, -44, 'active');

UPDATE esl_devices SET last_heartbeat = NOW() WHERE status = 'active';
UPDATE esl_devices SET last_heartbeat = DATE_SUB(NOW(), INTERVAL 1 HOUR) WHERE status = 'error';

-- 5.6 태그 템플릿 데이터
INSERT INTO tag_templates (organization_id, name, template_type, size_type, min_width, min_height, aspect_ratio, layout_config, category, is_default, created_by) VALUES
(1, '기본 가격표', 'price_tag', 'medium', 200, 150, '4:3', '{"elements": [{"type": "text", "field": "name", "style": {"fontSize": 16, "fontWeight": "bold"}}, {"type": "text", "field": "price", "style": {"fontSize": 24, "color": "#FF0000"}}]}', NULL, true, 1),
(1, '할인 강조형', 'promotion', 'large', 300, 200, '3:2', '{"elements": [{"type": "text", "field": "name", "style": {"fontSize": 14}}, {"type": "text", "field": "original_price", "style": {"fontSize": 16, "textDecoration": "line-through"}}, {"type": "text", "field": "current_price", "style": {"fontSize": 28, "color": "#FF0000", "fontWeight": "bold"}}]}', NULL, false, 1),
(1, '상품 정보형', 'info', 'flexible', 150, 100, 'flexible', '{"elements": [{"type": "text", "field": "name", "style": {"fontSize": 12}}, {"type": "text", "field": "description", "style": {"fontSize": 10}}]}', NULL, false, 1),
(2, '식품 전용', 'price_tag', 'medium', 220, 160, '4:3', '{"elements": [{"type": "text", "field": "name", "style": {"fontSize": 16}}, {"type": "text", "field": "price", "style": {"fontSize": 22}}, {"type": "text", "field": "unit", "style": {"fontSize": 12}}]}', '식품', false, 2);

-- 5.7 상품 데이터
INSERT INTO products (organization_id, sku, barcode, name, description, category, current_price, original_price, currency, unit, stock_level, is_promotion, promotion_end_date) VALUES
(2, 'FOOD-001', '8801234567890', '신선한 사과', '당도 높은 국내산 사과', '과일', 3900, 4500, 'KRW', '봉지(5입)', 150, true, '2025-08-31 23:59:59'),
(2, 'FOOD-002', '8801234567891', '유기농 바나나', '필리핀산 유기농 바나나', '과일', 2900, 3500, 'KRW', '송이', 200, true, '2025-08-15 23:59:59'),
(2, 'FOOD-003', '8801234567892', '토마토', '국내산 완숙 토마토', '채소', 4500, 5000, 'KRW', 'kg', 80, false, NULL),
(2, 'FOOD-004', '8801234567893', '양파', '국내산 양파', '채소', 2200, NULL, 'KRW', '망(3kg)', 120, false, NULL),
(2, 'LIFE-001', '8801234567894', '프리미엄 수건', '100% 순면 호텔 수건', '생활용품', 15900, 19900, 'KRW', '개', 50, true, '2025-07-31 23:59:59'),
(2, 'LIFE-002', '8801234567895', '주방세제', '친환경 주방세제', '생활용품', 3500, NULL, 'KRW', '병(1L)', 200, false, NULL),
(3, 'FOOD-005', '8801234567896', '신선 우유', '서울우유 1등급', '유제품', 2980, NULL, 'KRW', '팩(1L)', 100, false, NULL),
(3, 'LIFE-003', '8801234567897', '화장지', '3겹 프리미엄 화장지', '생활용품', 12900, 15900, 'KRW', '팩(30롤)', 80, true, '2025-08-10 23:59:59');

-- 5.8 가격 태그 데이터
INSERT INTO price_tags (device_id, product_id, tag_template_id, grid_position, grid_width, grid_height, is_active, display_order) VALUES
(1, 1, 2, 0, 1, 1, true, 1), -- 디바이스1 - 사과 (할인)
(1, 2, 2, 1, 1, 1, true, 2), -- 디바이스1 - 바나나 (할인)
(1, 3, 1, 2, 1, 1, true, 3), -- 디바이스1 - 토마토
(1, 4, 1, 3, 1, 1, true, 4), -- 디바이스1 - 양파
(2, 5, 2, 0, 1, 1, true, 1), -- 디바이스2 - 수건 (할인)
(2, 6, 1, 1, 1, 1, true, 2), -- 디바이스2 - 주방세제
(3, 1, 2, 0, 2, 1, true, 1), -- 디바이스3 - 사과 (2칸 차지)
(3, 2, 2, 2, 1, 1, true, 2), -- 디바이스3 - 바나나
(3, 3, 1, 3, 1, 1, true, 3), -- 디바이스3 - 토마토
(3, 4, 1, 4, 1, 1, true, 4), -- 디바이스3 - 양파
(3, NULL, NULL, 5, 1, 1, false, 5), -- 디바이스3 - 빈 태그
(5, 7, 4, 0, 1, 1, true, 1), -- 디바이스5 - 우유
(5, 8, 2, 1, 1, 1, true, 2), -- 디바이스5 - 화장지 (할인)
(7, 1, 4, 0, 1, 1, true, 1), -- 디바이스7 - 사과 (식품전용)
(7, 2, 4, 1, 1, 1, true, 2), -- 디바이스7 - 바나나 (식품전용)
(8, 3, 4, 0, 1, 1, true, 1), -- 디바이스8 - 토마토
(8, 4, 4, 1, 1, 1, true, 2); -- 디바이스8 - 양파

-- 5.9 콘텐츠 업데이트 기록
INSERT INTO content_updates (device_id, price_tag_id, product_id, update_type, status, created_by, created_at, completed_at) VALUES
(1, 1, 1, 'price', 'completed', 2, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 2, 2, 'price', 'completed', 2, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, NULL, NULL, 'device_template', 'completed', 2, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 12, 7, 'full', 'completed', 3, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(2, 6, 6, 'template', 'failed', 2, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NULL),
(1, NULL, NULL, 'layout', 'pending', 2, DATE_SUB(NOW(), INTERVAL 5 MINUTE), NULL);

UPDATE content_updates SET error_message = 'Device offline', retry_count = 3 WHERE status = 'failed';

-- 5.10 시스템 로그
INSERT INTO system_logs (organization_id, user_id, action, entity_type, entity_id, ip_address, user_agent, details) VALUES
(1, 1, 'user.create', 'users', 2, '192.168.1.100', 'Mozilla/5.0', '{"email": "gangnam.admin@emart.com"}'),
(2, 2, 'product.update', 'products', 1, '192.168.1.101', 'Mozilla/5.0', '{"field": "price", "old": 4500, "new": 3900}'),
(2, 2, 'device.template.change', 'esl_devices', 3, '192.168.1.101', 'Mozilla/5.0', '{"old_template": 1, "new_template": 3}'),
(3, 3, 'login', NULL, NULL, '192.168.1.102', 'Mozilla/5.0', '{"success": true}'),
(2, 4, 'product.create', 'products', 8, '192.168.1.103', 'Mozilla/5.0', '{"sku": "LIFE-003"}'),
(1, 1, 'role.assign', 'users', 7, '192.168.1.100', 'Mozilla/5.0', '{"role": "viewer"}');

-- ===============================================
-- 6. 데이터 조회 쿼리
-- ===============================================

-- 6.1 조직 계층 구조 조회
SELECT 
    o1.id,
    o1.name,
    o1.type,
    o1.level,
    o1.path,
    o2.name as parent_name,
    o1.address,
    o1.city,
    o1.district
FROM organizations o1
LEFT JOIN organizations o2 ON o1.parent_id = o2.id
ORDER BY o1.path;

-- 6.2 사용자별 권한 조회
SELECT 
    u.id,
    u.email,
    u.full_name,
    o.name as organization,
    GROUP_CONCAT(DISTINCT r.display_name) as roles,
    COUNT(DISTINCT p.id) as permission_count
FROM users u
LEFT JOIN organizations o ON u.organization_id = o.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
WHERE u.is_active = true
GROUP BY u.id, u.email, u.full_name, o.name;

-- 6.3 디바이스 상태 요약
SELECT 
    o.name as organization,
    d.device_type,
    dt.name as template_name,
    COUNT(d.id) as device_count,
    COUNT(CASE WHEN d.status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN d.status = 'error' THEN 1 END) as error_count,
    AVG(d.battery_level) as avg_battery,
    AVG(d.signal_strength) as avg_signal
FROM esl_devices d
JOIN organizations o ON d.organization_id = o.id
LEFT JOIN device_templates dt ON d.device_template_id = dt.id
GROUP BY o.name, d.device_type, dt.name;

-- 6.4 상품별 태그 현황
SELECT 
    p.sku,
    p.name as product_name,
    p.category,
    p.current_price,
    p.is_promotion,
    COUNT(pt.id) as tag_count,
    COUNT(DISTINCT d.id) as device_count,
    GROUP_CONCAT(DISTINCT o.name) as stores
FROM products p
LEFT JOIN price_tags pt ON p.id = pt.product_id AND pt.is_active = true
LEFT JOIN esl_devices d ON pt.device_id = d.id
LEFT JOIN organizations o ON d.organization_id = o.id
GROUP BY p.id, p.sku, p.name, p.category, p.current_price, p.is_promotion
ORDER BY tag_count DESC;

-- 6.5 최근 업데이트 현황
SELECT 
    cu.id,
    cu.update_type,
    cu.status,
    o.name as organization,
    d.mac_address,
    p.name as product_name,
    u.full_name as created_by,
    cu.created_at,
    cu.completed_at,
    cu.error_message
FROM content_updates cu
LEFT JOIN esl_devices d ON cu.device_id = d.id
LEFT JOIN organizations o ON d.organization_id = o.id
LEFT JOIN products p ON cu.product_id = p.id
LEFT JOIN users u ON cu.created_by = u.id
ORDER BY cu.created_at DESC
LIMIT 20;

-- 6.6 템플릿 사용 현황
SELECT 
    'device' as template_type,
    dt.name as template_name,
    dt.device_type,
    COUNT(d.id) as usage_count
FROM device_templates dt
LEFT JOIN esl_devices d ON dt.id = d.device_template_id
GROUP BY dt.id, dt.name, dt.device_type

UNION ALL

SELECT 
    'tag' as template_type,
    tt.name as template_name,
    tt.template_type as device_type,
    COUNT(pt.id) as usage_count
FROM tag_templates tt
LEFT JOIN price_tags pt ON tt.id = pt.tag_template_id
GROUP BY tt.id, tt.name, tt.template_type;

-- 6.7 지도 표시용 매장 위치 정보
SELECT 
    o.id,
    o.name,
    o.type,
    o.latitude,
    o.longitude,
    o.address,
    o.business_hours,
    COUNT(DISTINCT d.id) as total_devices,
    COUNT(DISTINCT CASE WHEN d.status = 'active' THEN d.id END) as active_devices,
    COUNT(DISTINCT p.id) as total_products
FROM organizations o
LEFT JOIN esl_devices d ON o.id = d.organization_id
LEFT JOIN price_tags pt ON d.id = pt.device_id AND pt.is_active = true
LEFT JOIN products p ON pt.product_id = p.id
WHERE o.latitude IS NOT NULL 
  AND o.longitude IS NOT NULL
  AND o.type = 'store'
GROUP BY o.id, o.name, o.type, o.latitude, o.longitude, o.address, o.business_hours;

-- 6.8 사용자 활동 로그
SELECT 
    sl.created_at,
    u.full_name as user_name,
    o.name as organization,
    sl.action,
    sl.entity_type,
    sl.entity_id,
    sl.ip_address,
    sl.details
FROM system_logs sl
JOIN users u ON sl.user_id = u.id
JOIN organizations o ON sl.organization_id = o.id
WHERE sl.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY sl.created_at DESC
LIMIT 50;

-- ===============================================
-- 7. 유용한 통계 쿼리
-- ===============================================

-- 7.1 조직별 리소스 사용 통계
SELECT 
    o.name as organization,
    o.type,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT d.id) as device_count,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT pt.id) as active_tag_count
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
LEFT JOIN esl_devices d ON o.id = d.organization_id
LEFT JOIN products p ON o.id = p.organization_id
LEFT JOIN price_tags pt ON d.id = pt.device_id AND pt.is_active = true
GROUP BY o.id, o.name, o.type
ORDER BY o.path;

-- 7.2 배터리 교체 필요 디바이스
SELECT 
    o.name as organization,
    d.mac_address,
    d.location_store,
    d.location_aisle,
    d.location_shelf,
    d.battery_level,
    d.last_heartbeat
FROM esl_devices d
JOIN organizations o ON d.organization_id = o.id
WHERE d.battery_level < 20
  AND d.status = 'active'
ORDER BY d.battery_level ASC;

-- 7.3 프로모션 만료 예정 상품
SELECT 
    o.name as organization,
    p.sku,
    p.name,
    p.current_price,
    p.original_price,
    ROUND((1 - p.current_price / p.original_price) * 100, 1) as discount_rate,
    p.promotion_end_date,
    DATEDIFF(p.promotion_end_date, NOW()) as days_remaining
FROM products p
JOIN organizations o ON p.organization_id = o.id
WHERE p.is_promotion = true
  AND p.promotion_end_date > NOW()
  AND p.promotion_end_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
ORDER BY p.promotion_end_date ASC;