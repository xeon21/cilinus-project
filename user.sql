-- RBAC(Role-Based Access Control) 기반 사용자 권한 관리 시스템
-- 생성일: 2025-07-21
-- 설명: 확장성 있는 역할 기반 접근 제어 시스템을 위한 데이터베이스 스키마

-- ===========================================
-- 1. 조직 테이블 (선택적)
-- ===========================================
CREATE TABLE IF NOT EXISTS organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES organizations(id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 2. 사용자 테이블 (users)
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NULL COMMENT '소속 조직 (선택적)',
    email VARCHAR(255) NOT NULL COMMENT '로그인 ID (전체 시스템에서 유일)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 해싱된 비밀번호',
    full_name VARCHAR(255) NOT NULL COMMENT '사용자 실명',
    is_active BOOLEAN DEFAULT TRUE COMMENT '계정 활성화 상태',
    last_login TIMESTAMP NULL DEFAULT NULL COMMENT '마지막 로그인 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '계정 수정 일시',
    UNIQUE KEY unique_email (email),
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    INDEX idx_email (email),
    INDEX idx_organization_id (organization_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 3. 역할 테이블 (roles)
-- ===========================================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '역할명 (영문)',
    display_name VARCHAR(100) NOT NULL COMMENT '역할 표시명 (다국어 지원)',
    description TEXT NULL COMMENT '역할 설명',
    is_system BOOLEAN DEFAULT FALSE COMMENT '시스템 기본 역할 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    UNIQUE KEY unique_name (name),
    INDEX idx_is_system (is_system)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 4. 권한 테이블 (permissions)
-- ===========================================
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource VARCHAR(100) NOT NULL COMMENT '리소스명 (menu, api, feature)',
    action VARCHAR(50) NOT NULL COMMENT '액션 (view, create, update, delete)',
    name VARCHAR(100) NOT NULL COMMENT '권한명 (resource.action)',
    description TEXT NULL COMMENT '권한 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    UNIQUE KEY unique_name (name),
    INDEX idx_resource (resource),
    INDEX idx_action (action),
    INDEX idx_resource_action (resource, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 5. 사용자-역할 매핑 테이블 (user_roles)
-- ===========================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL COMMENT '사용자 ID',
    role_id INT NOT NULL COMMENT '역할 ID',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '할당 일시',
    assigned_by INT NULL COMMENT '할당한 관리자',
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '만료 일시 (임시 권한용)',
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 6. 역할-권한 매핑 테이블 (role_permissions)
-- ===========================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL COMMENT '역할 ID',
    permission_id INT NOT NULL COMMENT '권한 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 7. 사용자별 개별 권한 테이블 (user_permissions) - 선택적
-- ===========================================
CREATE TABLE IF NOT EXISTS user_permissions (
    user_id INT NOT NULL COMMENT '사용자 ID',
    permission_id INT NOT NULL COMMENT '권한 ID',
    granted BOOLEAN DEFAULT TRUE COMMENT '권한 부여/제거 (true/false)',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '할당 일시',
    assigned_by INT NULL COMMENT '할당한 관리자',
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT '만료 일시',
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_permission_id (permission_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_granted (granted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 8. 기본 데이터 삽입
-- ===========================================

-- 8.1 조직 데이터
INSERT INTO organizations (name, parent_id) VALUES
('본사', NULL),
('서울지사', 1),
('부산지사', 1),
('개발팀', 2),
('영업팀', 2),
('고객지원팀', 3);

-- 8.2 시스템 기본 역할
INSERT INTO roles (name, display_name, description, is_system) VALUES
('super_admin', '최고 관리자', '전체 시스템 관리 권한을 가진 최고 관리자', TRUE),
('org_admin', '조직 관리자', '소속 조직 및 하위 조직 관리 권한', TRUE),
('manager', '매니저', '소속 조직 내 제품/가격 관리 및 리포트 생성', TRUE),
('operator', '운영자', '소속 조직 내 데이터 조회 및 기본 작업 수행', TRUE),
('viewer', '조회자', '대시보드 및 리포트 조회만 가능', TRUE);

-- 8.3 권한 데이터 - 메뉴 접근 권한
INSERT INTO permissions (resource, action, name, description) VALUES
('menu.admin', 'view', 'menu.admin.view', '관리자 메뉴 접근'),
('menu.dashboard', 'view', 'menu.dashboard.view', '대시보드 메뉴 접근'),
('menu.user_management', 'view', 'menu.user_management.view', '사용자 관리 메뉴 접근'),
('menu.product', 'view', 'menu.product.view', '제품 관리 메뉴 접근'),
('menu.report', 'view', 'menu.report.view', '리포트 메뉴 접근'),
('menu.settings', 'view', 'menu.settings.view', '설정 메뉴 접근');

-- 8.4 권한 데이터 - API 권한
INSERT INTO permissions (resource, action, name, description) VALUES
-- 사용자 API
('api.users', 'create', 'api.users.create', '사용자 생성 API'),
('api.users', 'read', 'api.users.read', '사용자 조회 API'),
('api.users', 'update', 'api.users.update', '사용자 수정 API'),
('api.users', 'delete', 'api.users.delete', '사용자 삭제 API'),
-- 제품 API
('api.products', 'create', 'api.products.create', '제품 생성 API'),
('api.products', 'read', 'api.products.read', '제품 조회 API'),
('api.products', 'update', 'api.products.update', '제품 수정 API'),
('api.products', 'delete', 'api.products.delete', '제품 삭제 API'),
-- 리포트 API
('api.reports', 'create', 'api.reports.create', '리포트 생성 API'),
('api.reports', 'read', 'api.reports.read', '리포트 조회 API'),
('api.reports', 'update', 'api.reports.update', '리포트 수정 API'),
('api.reports', 'delete', 'api.reports.delete', '리포트 삭제 API');

-- 8.5 권한 데이터 - 기능 권한
INSERT INTO permissions (resource, action, name, description) VALUES
('feature', 'export_data', 'feature.export_data', '데이터 내보내기 기능'),
('feature', 'bulk_import', 'feature.bulk_import', '대량 데이터 가져오기 기능'),
('feature', 'system_config', 'feature.system_config', '시스템 설정 변경 기능'),
('feature', 'audit_log', 'feature.audit_log', '감사 로그 조회 기능');

-- 8.6 역할-권한 매핑 - super_admin (모든 권한)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- 8.7 역할-권한 매핑 - org_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.user_management.view', 'menu.product.view', 'menu.report.view',
    'api.users.create', 'api.users.read', 'api.users.update',
    'api.products.create', 'api.products.read', 'api.products.update',
    'api.reports.create', 'api.reports.read',
    'feature.export_data', 'feature.bulk_import'
);

-- 8.8 역할-권한 매핑 - manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.product.view', 'menu.report.view',
    'api.products.read', 'api.products.update',
    'api.reports.create', 'api.reports.read',
    'feature.export_data'
);

-- 8.9 역할-권한 매핑 - operator
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.product.view',
    'api.products.read',
    'api.reports.read'
);

-- 8.10 역할-권한 매핑 - viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions 
WHERE name IN (
    'menu.dashboard.view', 'menu.report.view',
    'api.reports.read'
);

-- ===========================================
-- 9. 테스트용 목업 데이터
-- ===========================================

-- 9.1 테스트 사용자 (비밀번호는 모두 'password123'의 bcrypt 해시)
INSERT INTO users (organization_id, email, password_hash, full_name, is_active) VALUES
-- 최고 관리자
(1, 'super@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '김철수', TRUE),
-- 조직 관리자들
(2, 'seoul.admin@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '이영희', TRUE),
(3, 'busan.admin@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '박민수', TRUE),
-- 매니저들
(4, 'dev.manager@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '정현진', TRUE),
(5, 'sales.manager@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '강미나', TRUE),
-- 운영자들
(4, 'dev.operator1@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '윤서준', TRUE),
(5, 'sales.operator1@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '임지우', TRUE),
(6, 'support.operator1@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '조예린', TRUE),
-- 조회자들
(4, 'dev.viewer1@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '최동현', TRUE),
(5, 'sales.viewer1@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '송하늘', TRUE),
-- 비활성 사용자 (테스트용)
(4, 'inactive@example.com', '$2b$10$YGgJY7hECp.0xKHMcIj2hOxqMEANfG4NbY0NSYrWImG8K7PaJVMDm', '비활성사용자', FALSE);

-- 9.2 사용자-역할 할당
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
-- 최고 관리자
(1, 1, NULL),
-- 조직 관리자들
(2, 2, 1),
(3, 2, 1),
-- 매니저들
(4, 3, 2),
(5, 3, 2),
-- 운영자들
(6, 4, 4),
(7, 4, 5),
(8, 4, 3),
-- 조회자들
(9, 5, 4),
(10, 5, 5);

-- 9.3 임시 권한 부여 예시 (30일 후 만료)
INSERT INTO user_roles (user_id, role_id, assigned_by, expires_at) VALUES
(9, 4, 1, DATE_ADD(NOW(), INTERVAL 30 DAY));  -- 조회자에게 임시로 운영자 권한 부여

-- 9.4 개별 권한 부여 예시
-- 운영자에게 특별히 사용자 생성 권한 부여
INSERT INTO user_permissions (user_id, permission_id, granted, assigned_by)
SELECT 6, id, TRUE, 1 FROM permissions WHERE name = 'api.users.create';

-- 매니저에게서 제품 수정 권한 제거
INSERT INTO user_permissions (user_id, permission_id, granted, assigned_by)
SELECT 4, id, FALSE, 1 FROM permissions WHERE name = 'api.products.update';

-- 9.5 로그인 이력 업데이트 (일부 사용자)
UPDATE users SET last_login = DATE_SUB(NOW(), INTERVAL 1 HOUR) WHERE id = 1;
UPDATE users SET last_login = DATE_SUB(NOW(), INTERVAL 2 DAY) WHERE id = 2;
UPDATE users SET last_login = DATE_SUB(NOW(), INTERVAL 1 WEEK) WHERE id = 4;

-- ===========================================
-- 10. 유용한 뷰 생성 (선택적)
-- ===========================================

-- 사용자별 권한 전체 목록 뷰
CREATE OR REPLACE VIEW v_user_permissions AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.is_active,
    p.name as permission_name,
    p.resource,
    p.action,
    'role' as permission_source,
    r.name as role_name,
    ur.expires_at as role_expires_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.is_active = TRUE
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())

UNION

SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.is_active,
    p.name as permission_name,
    p.resource,
    p.action,
    CASE WHEN up.granted THEN 'direct_grant' ELSE 'direct_revoke' END as permission_source,
    NULL as role_name,
    up.expires_at as role_expires_at
FROM users u
JOIN user_permissions up ON u.id = up.user_id
JOIN permissions p ON up.permission_id = p.id
WHERE u.is_active = TRUE
  AND (up.expires_at IS NULL OR up.expires_at > NOW());

-- ===========================================
-- 11. 권한 확인 프로시저 (선택적)
-- ===========================================

DELIMITER //

CREATE PROCEDURE sp_check_user_permission(
    IN p_user_id INT,
    IN p_permission_name VARCHAR(100),
    OUT p_has_permission BOOLEAN
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    -- 역할 기반 권한 확인
    SELECT COUNT(*) INTO v_count
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = p_user_id 
      AND p.name = p_permission_name
      AND u.is_active = TRUE
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
    
    IF v_count > 0 THEN
        -- 개별 권한에서 제거되었는지 확인
        SELECT COUNT(*) INTO v_count
        FROM user_permissions up
        JOIN permissions p ON up.permission_id = p.id
        WHERE up.user_id = p_user_id 
          AND p.name = p_permission_name
          AND up.granted = FALSE
          AND (up.expires_at IS NULL OR up.expires_at > NOW());
        
        IF v_count > 0 THEN
            SET p_has_permission = FALSE;
        ELSE
            SET p_has_permission = TRUE;
        END IF;
    ELSE
        -- 개별 권한으로 부여되었는지 확인
        SELECT COUNT(*) INTO v_count
        FROM user_permissions up
        JOIN permissions p ON up.permission_id = p.id
        WHERE up.user_id = p_user_id 
          AND p.name = p_permission_name
          AND up.granted = TRUE
          AND (up.expires_at IS NULL OR up.expires_at > NOW());
        
        IF v_count > 0 THEN
            SET p_has_permission = TRUE;
        ELSE
            SET p_has_permission = FALSE;
        END IF;
    END IF;
END//

DELIMITER ;

-- ===========================================
-- 12. 테스트 쿼리 예시
-- ===========================================

-- 특정 사용자의 모든 권한 조회
SELECT DISTINCT permission_name, permission_source, role_name 
FROM v_user_permissions 
WHERE user_id = 1
ORDER BY permission_name;

-- 특정 권한을 가진 모든 사용자 조회
SELECT DISTINCT user_id, email, full_name, role_name
FROM v_user_permissions
WHERE permission_name = 'api.users.create'
ORDER BY user_id;

-- 프로시저를 사용한 권한 확인
CALL sp_check_user_permission(6, 'api.users.create', @has_permission);
SELECT @has_permission;

-- 조직별 사용자 수 통계
SELECT 
    o.name as organization_name,
    COUNT(u.id) as user_count,
    SUM(CASE WHEN u.is_active = TRUE THEN 1 ELSE 0 END) as active_users
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
GROUP BY o.id, o.name
ORDER BY o.id;