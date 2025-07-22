-- ===============================================
-- 차세대 LCD ESL 데이터베이스 SQL
-- 작성일: 2025-07-21
-- 버전: 1.0
-- ===============================================

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS cilinus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cilinus;

-- ===============================================
-- 1. 테이블 생성
-- ===============================================
-- 1. 조직 기본 테이블 (parent_id, level, path 제거)
  CREATE TABLE organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL COMMENT 'headquarters, branch, store',
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
      INDEX idx_type (type),
      INDEX idx_city (city),
      INDEX idx_name (name)
  );

  -- 2. 계층 관계를 관리하는 Closure 테이블
  CREATE TABLE organization_closure (
      ancestor_id INT NOT NULL,
      descendant_id INT NOT NULL,
      depth INT NOT NULL DEFAULT 0,
      PRIMARY KEY (ancestor_id, descendant_id),
      FOREIGN KEY (ancestor_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (descendant_id) REFERENCES organizations(id) ON DELETE CASCADE,
      INDEX idx_descendant (descendant_id),
      INDEX idx_depth (depth),
      INDEX idx_anc_depth (ancestor_id, depth)
  );

  -- 3. 뷰 생성 (계층 정보를 포함한 조직 정보 조회용)
  CREATE VIEW organization_hierarchy AS
  SELECT
      o.*,
      (SELECT depth FROM organization_closure
       WHERE descendant_id = o.id AND ancestor_id != o.id
       ORDER BY depth DESC LIMIT 1) as level,
      (SELECT o2.id FROM organizations o2
       JOIN organization_closure oc ON o2.id = oc.ancestor_id
       WHERE oc.descendant_id = o.id AND oc.depth = 1) as parent_id,
      (SELECT GROUP_CONCAT(ancestor_id ORDER BY depth DESC SEPARATOR '/')
       FROM organization_closure
       WHERE descendant_id = o.id) as path
  FROM organizations o;

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
