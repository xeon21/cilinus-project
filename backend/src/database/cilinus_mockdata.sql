-- ===============================================
-- 차세대 LCD ESL 목업 데이터 SQL
-- 작성일: 2025-07-21
-- 버전: 1.0
-- ===============================================

USE cilinus;

-- ===============================================
-- 1. 기본 역할(Roles) 데이터
-- ===============================================
INSERT INTO roles (name, display_name, description, is_system) VALUES
('super_admin', '시스템 관리자', '시스템 전체 관리 권한', true),
('admin', '관리자', '조직 내 전체 관리 권한', true),
('manager', '매니저', '매장 관리 권한', true),
('staff', '직원', '기본 사용 권한', true),
('viewer', '열람자', '읽기 전용 권한', true);

-- ===============================================
-- 2. 권한(Permissions) 데이터
-- ===============================================
INSERT INTO permissions (resource, action, name, description) VALUES
-- 조직 관리
('organization', 'create', 'organization.create', '조직 생성'),
('organization', 'read', 'organization.read', '조직 조회'),
('organization', 'update', 'organization.update', '조직 수정'),
('organization', 'delete', 'organization.delete', '조직 삭제'),

-- 사용자 관리
('user', 'create', 'user.create', '사용자 생성'),
('user', 'read', 'user.read', '사용자 조회'),
('user', 'update', 'user.update', '사용자 수정'),
('user', 'delete', 'user.delete', '사용자 삭제'),

-- 디바이스 관리
('device', 'create', 'device.create', '디바이스 생성'),
('device', 'read', 'device.read', '디바이스 조회'),
('device', 'update', 'device.update', '디바이스 수정'),
('device', 'delete', 'device.delete', '디바이스 삭제'),

-- 상품 관리
('product', 'create', 'product.create', '상품 생성'),
('product', 'read', 'product.read', '상품 조회'),
('product', 'update', 'product.update', '상품 수정'),
('product', 'delete', 'product.delete', '상품 삭제'),

-- 태그 관리
('tag', 'create', 'tag.create', '태그 생성'),
('tag', 'read', 'tag.read', '태그 조회'),
('tag', 'update', 'tag.update', '태그 수정'),
('tag', 'delete', 'tag.delete', '태그 삭제'),

-- 템플릿 관리
('template', 'create', 'template.create', '템플릿 생성'),
('template', 'read', 'template.read', '템플릿 조회'),
('template', 'update', 'template.update', '템플릿 수정'),
('template', 'delete', 'template.delete', '템플릿 삭제'),

-- 시스템 로그
('log', 'read', 'log.read', '로그 조회'),
('log', 'export', 'log.export', '로그 내보내기');

-- ===============================================
-- 3. 역할-권한 매핑
-- ===============================================
-- Super Admin: 모든 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Admin: 로그 내보내기를 제외한 모든 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name != 'log.export';

-- Manager: 읽기, 수정 권한
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE action IN ('read', 'update');

-- Staff: 읽기, 생성 권한 (삭제 불가)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE action IN ('read', 'create');

-- Viewer: 읽기 권한만
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions WHERE action = 'read';

-- ===============================================
-- 4. 조직(Organizations) 목업 데이터
-- ===============================================
-- 본사
INSERT INTO organizations (name, type, address, address_detail, postal_code, city, district, latitude, longitude, phone, business_hours) VALUES
('CJ프레시웨이 본사', 'headquarters', '서울특별시 중구 동호로 330', 'CJ제일제당센터', '04560', '서울', '중구', 37.5579, 127.0078, '02-6740-1114', 
'{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "closed", "sun": "closed"}');

-- 지점들
INSERT INTO organizations (name, type, address, address_detail, postal_code, city, district, latitude, longitude, phone, business_hours) VALUES
('서울지점', 'branch', '서울특별시 강남구 테헤란로 123', '강남빌딩 5층', '06234', '서울', '강남구', 37.5012, 127.0396, '02-555-0001',
'{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "09:00-14:00", "sun": "closed"}'),

('경기지점', 'branch', '경기도 성남시 분당구 판교로 255', '판교테크노밸리', '13486', '경기', '성남시', 37.4020, 127.1087, '031-555-0002',
'{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "09:00-14:00", "sun": "closed"}'),

('부산지점', 'branch', '부산광역시 해운대구 센텀중앙로 79', '센텀사이언스파크', '48058', '부산', '해운대구', 35.1690, 129.1308, '051-555-0003',
'{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "09:00-14:00", "sun": "closed"}');

-- 매장들
INSERT INTO organizations (name, type, address, address_detail, postal_code, city, district, latitude, longitude, phone, business_hours) VALUES
-- 서울지점 산하 매장
('강남점', 'store', '서울특별시 강남구 강남대로 456', '1층', '06123', '서울', '강남구', 37.4979, 127.0276, '02-333-1001',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

('역삼점', 'store', '서울특별시 강남구 역삼로 234', 'B1층', '06234', '서울', '강남구', 37.5006, 127.0364, '02-333-1002',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

('삼성점', 'store', '서울특별시 강남구 삼성로 567', '2층', '06345', '서울', '강남구', 37.5123, 127.0634, '02-333-1003',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

-- 경기지점 산하 매장
('분당점', 'store', '경기도 성남시 분당구 정자로 123', '1층', '13561', '경기', '성남시', 37.3595, 127.1052, '031-333-2001',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

('판교점', 'store', '경기도 성남시 분당구 판교역로 235', 'B1층', '13487', '경기', '성남시', 37.3947, 127.1112, '031-333-2002',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

-- 부산지점 산하 매장
('센텀시티점', 'store', '부산광역시 해운대구 센텀남대로 35', '1층', '48050', '부산', '해운대구', 35.1689, 129.1300, '051-333-3001',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}'),

('해운대점', 'store', '부산광역시 해운대구 해운대로 570', '1층', '48094', '부산', '해운대구', 35.1628, 129.1635, '051-333-3002',
'{"mon": "10:00-22:00", "tue": "10:00-22:00", "wed": "10:00-22:00", "thu": "10:00-22:00", "fri": "10:00-22:00", "sat": "10:00-22:00", "sun": "10:00-21:00"}');

-- ===============================================
-- 5. 조직 계층 구조 설정 (Closure Table)
-- ===============================================
-- 자기 자신 참조
INSERT INTO organization_closure (ancestor_id, descendant_id, depth)
SELECT id, id, 0 FROM organizations;

-- 본사 -> 지점
INSERT INTO organization_closure (ancestor_id, descendant_id, depth) VALUES
(1, 2, 1), -- 본사 -> 서울지점
(1, 3, 1), -- 본사 -> 경기지점
(1, 4, 1); -- 본사 -> 부산지점

-- 본사 -> 매장 (depth 2)
INSERT INTO organization_closure (ancestor_id, descendant_id, depth) VALUES
(1, 5, 2), (1, 6, 2), (1, 7, 2), -- 본사 -> 서울 매장들
(1, 8, 2), (1, 9, 2), -- 본사 -> 경기 매장들
(1, 10, 2), (1, 11, 2); -- 본사 -> 부산 매장들

-- 지점 -> 매장
INSERT INTO organization_closure (ancestor_id, descendant_id, depth) VALUES
(2, 5, 1), (2, 6, 1), (2, 7, 1), -- 서울지점 -> 매장들
(3, 8, 1), (3, 9, 1), -- 경기지점 -> 매장들
(4, 10, 1), (4, 11, 1); -- 부산지점 -> 매장들

-- ===============================================
-- 6. 사용자(Users) 목업 데이터
-- ===============================================
INSERT INTO users (organization_id, email, password_hash, full_name, is_active) VALUES
-- 본사 사용자
(1, 'superadmin@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '시스템관리자', true),
(1, 'admin@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '본사관리자', true),

-- 지점 관리자
(2, 'seoul.admin@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '서울지점관리자', true),
(3, 'gyeonggi.admin@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '경기지점관리자', true),
(4, 'busan.admin@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '부산지점관리자', true),

-- 매장 매니저
(5, 'gangnam.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '강남점매니저', true),
(6, 'yeoksam.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '역삼점매니저', true),
(7, 'samsung.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '삼성점매니저', true),
(8, 'bundang.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '분당점매니저', true),
(9, 'pangyo.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '판교점매니저', true),
(10, 'centum.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '센텀시티점매니저', true),
(11, 'haeundae.manager@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '해운대점매니저', true),

-- 매장 직원
(5, 'gangnam.staff1@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '강남점직원1', true),
(5, 'gangnam.staff2@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '강남점직원2', true),
(6, 'yeoksam.staff1@cjfreshway.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '역삼점직원1', true);

-- ===============================================
-- 7. 사용자 역할 할당
-- ===============================================
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
(1, 1, NULL), -- 시스템관리자 -> super_admin
(2, 2, 1),    -- 본사관리자 -> admin
(3, 2, 1),    -- 서울지점관리자 -> admin
(4, 2, 1),    -- 경기지점관리자 -> admin
(5, 2, 1),    -- 부산지점관리자 -> admin
(6, 3, 3),    -- 강남점매니저 -> manager
(7, 3, 3),    -- 역삼점매니저 -> manager
(8, 3, 3),    -- 삼성점매니저 -> manager
(9, 3, 4),    -- 분당점매니저 -> manager
(10, 3, 4),   -- 판교점매니저 -> manager
(11, 3, 5),   -- 센텀시티점매니저 -> manager
(12, 3, 5),   -- 해운대점매니저 -> manager
(13, 4, 6),   -- 강남점직원1 -> staff
(14, 4, 6),   -- 강남점직원2 -> staff
(15, 4, 7);   -- 역삼점직원1 -> staff

-- ===============================================
-- 8. 디바이스 템플릿
-- ===============================================
INSERT INTO device_templates (organization_id, name, device_type, layout_type, max_tags, grid_config, is_default, created_by) VALUES
(NULL, '23인치 2x2 기본 템플릿', '23inch', 'grid_2x2', 4, 
'{"rows": 2, "cols": 2, "cellWidth": "50%", "cellHeight": "50%", "gap": "10px"}', true, 1),

(NULL, '23인치 1x4 세로 템플릿', '23inch', 'grid_1x4', 4,
'{"rows": 4, "cols": 1, "cellWidth": "100%", "cellHeight": "25%", "gap": "5px"}', true, 1),

(NULL, '29인치 2x3 템플릿', '29inch', 'grid_2x3', 6,
'{"rows": 3, "cols": 2, "cellWidth": "50%", "cellHeight": "33.33%", "gap": "10px"}', true, 1),

(1, 'CJ프레시웨이 커스텀 23인치', '23inch', 'custom', 5,
'{"customLayout": true, "positions": [{"x": 0, "y": 0, "width": "40%", "height": "40%"}, {"x": "45%", "y": 0, "width": "55%", "height": "40%"}, {"x": 0, "y": "45%", "width": "100%", "height": "55%"}]}', false, 2);

-- ===============================================
-- 9. ESL 디바이스
-- ===============================================
INSERT INTO esl_devices (organization_id, device_template_id, mac_address, device_type, firmware_version, location_store, location_aisle, location_shelf, battery_level, signal_strength, status, last_heartbeat) VALUES
-- 강남점 디바이스
(5, 1, 'AA:BB:CC:DD:EE:01', '23inch', 'v2.1.0', '강남점', 'A', '1', 95, 85, 'active', NOW()),
(5, 1, 'AA:BB:CC:DD:EE:02', '23inch', 'v2.1.0', '강남점', 'A', '2', 92, 82, 'active', NOW()),
(5, 2, 'AA:BB:CC:DD:EE:03', '23inch', 'v2.1.0', '강남점', 'B', '1', 88, 79, 'active', NOW()),
(5, 3, 'AA:BB:CC:DD:EE:04', '29inch', 'v2.1.0', '강남점', 'C', '1', 85, 75, 'active', NOW() - INTERVAL 5 MINUTE),

-- 역삼점 디바이스
(6, 1, 'AA:BB:CC:DD:EE:11', '23inch', 'v2.1.0', '역삼점', 'A', '1', 90, 80, 'active', NOW()),
(6, 1, 'AA:BB:CC:DD:EE:12', '23inch', 'v2.1.0', '역삼점', 'A', '2', 87, 78, 'active', NOW()),
(6, 2, 'AA:BB:CC:DD:EE:13', '23inch', 'v2.0.9', '역삼점', 'B', '1', 82, 72, 'active', NOW() - INTERVAL 10 MINUTE),

-- 삼성점 디바이스 (일부 오류 상태)
(7, 1, 'AA:BB:CC:DD:EE:21', '23inch', 'v2.1.0', '삼성점', 'A', '1', 93, 83, 'active', NOW()),
(7, 1, 'AA:BB:CC:DD:EE:22', '23inch', 'v2.0.8', '삼성점', 'A', '2', 15, 65, 'error', NOW() - INTERVAL 1 HOUR),
(7, 3, 'AA:BB:CC:DD:EE:23', '29inch', 'v2.1.0', '삼성점', 'C', '1', 0, 0, 'inactive', NOW() - INTERVAL 2 HOUR),

-- 분당점 디바이스
(8, 1, 'AA:BB:CC:DD:EE:31', '23inch', 'v2.1.0', '분당점', 'A', '1', 96, 88, 'active', NOW()),
(8, 2, 'AA:BB:CC:DD:EE:32', '23inch', 'v2.1.0', '분당점', 'B', '1', 91, 84, 'active', NOW()),

-- 판교점 디바이스
(9, 4, 'AA:BB:CC:DD:EE:41', '23inch', 'v2.1.0', '판교점', 'A', '1', 89, 81, 'active', NOW()),
(9, 3, 'AA:BB:CC:DD:EE:42', '29inch', 'v2.1.0', '판교점', 'B', '1', 94, 86, 'active', NOW());

-- ===============================================
-- 10. 태그 템플릿
-- ===============================================
INSERT INTO tag_templates (organization_id, name, template_type, size_type, min_width, min_height, aspect_ratio, layout_config, category, is_default, created_by) VALUES
-- 기본 템플릿
(NULL, '기본 가격표', 'price_tag', 'medium', 200, 150, '4:3',
'{"elements": [{"type": "product_name", "position": {"x": 10, "y": 10}, "style": {"fontSize": 18, "fontWeight": "bold"}}, {"type": "price", "position": {"x": 10, "y": 60}, "style": {"fontSize": 36, "fontWeight": "bold", "color": "#FF0000"}}]}',
'기본', true, 1),

(NULL, '프로모션 가격표', 'promotion', 'large', 300, 200, '3:2',
'{"elements": [{"type": "product_name", "position": {"x": 10, "y": 10}}, {"type": "original_price", "position": {"x": 10, "y": 50}, "style": {"textDecoration": "line-through"}}, {"type": "price", "position": {"x": 10, "y": 90}, "style": {"fontSize": 42, "color": "#FF0000"}}, {"type": "discount_rate", "position": {"x": 200, "y": 90}, "style": {"fontSize": 32, "color": "#0000FF"}}]}',
'프로모션', true, 1),

(NULL, '정보 표시', 'info', 'small', 150, 100, '3:2',
'{"elements": [{"type": "text", "position": {"x": 10, "y": 10}, "content": "정보"}]}',
'정보', true, 1),

-- 조직별 커스텀 템플릿
(1, 'CJ프레시웨이 특가', 'promotion', 'flexible', 250, 180, '5:3',
'{"elements": [{"type": "logo", "position": {"x": 10, "y": 10}, "url": "/assets/cj-logo.png"}, {"type": "product_name", "position": {"x": 10, "y": 50}}, {"type": "price", "position": {"x": 10, "y": 100}, "style": {"fontSize": 48}}]}',
'특가', false, 2);

-- ===============================================
-- 11. 상품 정보
-- ===============================================
INSERT INTO products (organization_id, sku, barcode, name, description, category, current_price, original_price, currency, unit, stock_level, is_promotion, promotion_end_date) VALUES
-- 강남점 상품
(5, 'SKU001', '8801234567890', '코카콜라 355ml', '시원한 탄산음료', '음료', 1200, 1500, 'KRW', '개', 150, true, NOW() + INTERVAL 7 DAY),
(5, 'SKU002', '8801234567891', '펩시콜라 355ml', '상쾌한 탄산음료', '음료', 1100, 1500, 'KRW', '개', 120, true, NOW() + INTERVAL 7 DAY),
(5, 'SKU003', '8801234567892', '새우깡 90g', '바삭한 새우맛 과자', '과자', 1500, NULL, 'KRW', '봉', 200, false, NULL),
(5, 'SKU004', '8801234567893', '초코파이 12개입', '부드러운 초콜릿 과자', '과자', 4500, 5000, 'KRW', '박스', 80, true, NOW() + INTERVAL 3 DAY),
(5, 'SKU005', '8801234567894', '신라면 5개입', '매운맛 라면', '라면', 3900, NULL, 'KRW', '묶음', 100, false, NULL),

-- 역삼점 상품
(6, 'SKU001', '8801234567890', '코카콜라 355ml', '시원한 탄산음료', '음료', 1300, 1500, 'KRW', '개', 100, true, NOW() + INTERVAL 5 DAY),
(6, 'SKU006', '8801234567895', '짜파게티 5개입', '짜장맛 라면', '라면', 4200, NULL, 'KRW', '묶음', 90, false, NULL),
(6, 'SKU007', '8801234567896', '허니버터칩', '달콤한 감자칩', '과자', 1800, 2000, 'KRW', '봉', 150, true, NOW() + INTERVAL 2 DAY),

-- 삼성점 상품
(7, 'SKU001', '8801234567890', '코카콜라 355ml', '시원한 탄산음료', '음료', 1250, 1500, 'KRW', '개', 80, true, NOW() + INTERVAL 7 DAY),
(7, 'SKU008', '8801234567897', '빼빼로 아몬드', '아몬드 초콜릿 과자', '과자', 1200, NULL, 'KRW', '개', 200, false, NULL),
(7, 'SKU009', '8801234567898', '육개장 사발면', '매운 육개장맛', '라면', 1100, 1300, 'KRW', '개', 150, true, NOW() + INTERVAL 1 DAY),

-- 분당점 상품
(8, 'SKU010', '8801234567899', '몽쉘 크림케이크', '부드러운 크림케이크', '제과', 3500, NULL, 'KRW', '개', 50, false, NULL),
(8, 'SKU011', '8801234567900', '바나나우유', '달콤한 바나나 우유', '음료', 1600, 1800, 'KRW', '개', 100, true, NOW() + INTERVAL 4 DAY),

-- 판교점 상품
(9, 'SKU012', '8801234567901', '진라면 순한맛', '순한맛 라면', '라면', 900, NULL, 'KRW', '개', 300, false, NULL),
(9, 'SKU013', '8801234567902', '오예스', '초콜릿 케이크', '과자', 2500, 3000, 'KRW', '박스', 60, true, NOW() + INTERVAL 10 DAY);

-- ===============================================
-- 12. 가격 태그 배치
-- ===============================================
INSERT INTO price_tags (device_id, product_id, tag_template_id, grid_position, grid_width, grid_height, is_active, display_order) VALUES
-- 강남점 디바이스 1 (2x2 그리드)
(1, 1, 2, 1, 1, 1, true, 1), -- 코카콜라 프로모션
(1, 2, 2, 2, 1, 1, true, 2), -- 펩시콜라 프로모션
(1, 3, 1, 3, 1, 1, true, 3), -- 새우깡
(1, 4, 2, 4, 1, 1, true, 4), -- 초코파이 프로모션

-- 강남점 디바이스 2 (2x2 그리드)
(2, 5, 1, 1, 1, 1, true, 1), -- 신라면
(2, 1, 2, 2, 1, 1, true, 2), -- 코카콜라 프로모션 (중복 표시)
(2, NULL, 3, 3, 1, 1, true, 3), -- 정보 표시
(2, NULL, 3, 4, 1, 1, true, 4), -- 정보 표시

-- 강남점 디바이스 3 (1x4 세로)
(3, 1, 2, 1, 1, 1, true, 1),
(3, 2, 2, 2, 1, 1, true, 2),
(3, 3, 1, 3, 1, 1, true, 3),
(3, 4, 2, 4, 1, 1, true, 4),

-- 강남점 디바이스 4 (29인치 2x3)
(4, 1, 4, 1, 1, 1, true, 1), -- CJ프레시웨이 특가 템플릿
(4, 2, 4, 2, 1, 1, true, 2),
(4, 3, 1, 3, 1, 1, true, 3),
(4, 4, 4, 4, 1, 1, true, 4),
(4, 5, 1, 5, 1, 1, true, 5),
(4, NULL, 3, 6, 1, 1, true, 6),

-- 역삼점 디바이스
(5, 6, 1, 1, 1, 1, true, 1),
(5, 7, 1, 2, 1, 1, true, 2),
(5, 8, 2, 3, 1, 1, true, 3),
(5, 6, 1, 4, 1, 1, true, 4),

-- 삼성점 디바이스 (일부만 활성)
(8, 9, 1, 1, 1, 1, true, 1),
(8, 10, 1, 2, 1, 1, true, 2),
(8, 11, 2, 3, 1, 1, false, 3), -- 비활성
(8, 9, 1, 4, 1, 1, false, 4); -- 비활성

-- ===============================================
-- 13. 콘텐츠 업데이트 기록
-- ===============================================
INSERT INTO content_updates (device_id, price_tag_id, product_id, tag_template_id, update_type, status, created_by, created_at, completed_at) VALUES
-- 완료된 업데이트
(1, 1, 1, 2, 'price', 'completed', 6, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR + INTERVAL 5 SECOND),
(1, 2, 2, 2, 'price', 'completed', 6, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR + INTERVAL 3 SECOND),
(2, 5, 5, 1, 'full', 'completed', 6, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR + INTERVAL 10 SECOND),

-- 진행 중인 업데이트
(3, 9, 1, 2, 'template', 'in_progress', 6, NOW() - INTERVAL 5 MINUTE, NULL),
(4, 13, 1, 4, 'price', 'pending', 6, NOW() - INTERVAL 2 MINUTE, NULL),

-- 실패한 업데이트
(8, 19, 9, 1, 'full', 'failed', 8, NOW() - INTERVAL 30 MINUTE, NOW() - INTERVAL 29 MINUTE),
(9, NULL, NULL, NULL, 'device_template', 'failed', 8, NOW() - INTERVAL 20 MINUTE, NOW() - INTERVAL 19 MINUTE);

-- 실패한 업데이트에 오류 메시지 추가
UPDATE content_updates SET error_message = 'Device not responding', retry_count = 3 WHERE id = 6;
UPDATE content_updates SET error_message = 'Network timeout', retry_count = 2 WHERE id = 7;

-- ===============================================
-- 14. 시스템 로그
-- ===============================================
INSERT INTO system_logs (organization_id, user_id, action, entity_type, entity_id, ip_address, user_agent, details, created_at) VALUES
-- 로그인 로그
(1, 1, 'user.login', 'user', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"success": true}', NOW() - INTERVAL 3 HOUR),
(1, 2, 'user.login', 'user', 2, '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"success": true}', NOW() - INTERVAL 2 HOUR),
(5, 6, 'user.login', 'user', 6, '192.168.1.110', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{"success": true}', NOW() - INTERVAL 1 HOUR),

-- 상품 수정 로그
(5, 6, 'product.update', 'product', 1, '192.168.1.110', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 
'{"fields": ["current_price", "is_promotion"], "old_values": {"current_price": 1500, "is_promotion": false}, "new_values": {"current_price": 1200, "is_promotion": true}}', 
NOW() - INTERVAL 2 HOUR),

-- 디바이스 상태 변경 로그
(7, 8, 'device.update', 'device', 9, '192.168.1.120', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
'{"fields": ["status"], "old_values": {"status": "active"}, "new_values": {"status": "error"}}',
NOW() - INTERVAL 1 HOUR),

-- 템플릿 생성 로그
(1, 2, 'template.create', 'tag_template', 4, '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
'{"name": "CJ프레시웨이 특가", "type": "promotion"}',
NOW() - INTERVAL 5 HOUR),

-- 권한 부여 로그
(5, 3, 'permission.grant', 'user', 13, '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
'{"role": "staff", "user": "gangnam.staff1@cjfreshway.com"}',
NOW() - INTERVAL 4 HOUR);

-- ===============================================
-- 15. 추가 인덱스 생성
-- ===============================================
-- 성능 최적화를 위한 추가 인덱스

-- 사용자 관련
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_user_last_login ON users(last_login);

-- 디바이스 관련
CREATE INDEX idx_devices_org ON esl_devices(organization_id);
CREATE INDEX idx_devices_status ON esl_devices(status);
CREATE INDEX idx_devices_heartbeat ON esl_devices(last_heartbeat);
CREATE INDEX idx_devices_location ON esl_devices(location_store, location_aisle, location_shelf);
CREATE INDEX idx_devices_battery ON esl_devices(battery_level);

-- 상품 관련
CREATE INDEX idx_products_org_sku ON products(organization_id, sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_promotion ON products(is_promotion, promotion_end_date);
CREATE INDEX idx_products_name ON products(name);

-- 가격 태그 관련
CREATE INDEX idx_tags_device ON price_tags(device_id);
CREATE INDEX idx_tags_product ON price_tags(product_id);
CREATE INDEX idx_tags_active ON price_tags(is_active);
CREATE INDEX idx_tags_order ON price_tags(device_id, display_order);

-- 업데이트 관련
CREATE INDEX idx_updates_status ON content_updates(status);
CREATE INDEX idx_updates_created ON content_updates(created_at);
CREATE INDEX idx_updates_device_status ON content_updates(device_id, status);

-- 로그 관련
CREATE INDEX idx_logs_org_action ON system_logs(organization_id, action);
CREATE INDEX idx_logs_user ON system_logs(user_id);
CREATE INDEX idx_logs_entity ON system_logs(entity_type, entity_id);
CREATE INDEX idx_logs_created ON system_logs(created_at);

-- 조직 계층 관련
CREATE INDEX idx_closure_anc_desc ON organization_closure(ancestor_id, descendant_id);

-- ===============================================
-- 16. 저장 프로시저 (추천 함수)
-- ===============================================
DELIMITER $$

-- 조직의 모든 하위 조직 가져오기
CREATE PROCEDURE GetOrganizationDescendants(IN org_id INT)
BEGIN
    SELECT o.*, oc.depth as level
    FROM organizations o
    INNER JOIN organization_closure oc ON o.id = oc.descendant_id
    WHERE oc.ancestor_id = org_id
    ORDER BY oc.depth, o.name;
END$$

-- 조직의 모든 상위 조직 가져오기
CREATE PROCEDURE GetOrganizationAncestors(IN org_id INT)
BEGIN
    SELECT o.*, oc.depth as level
    FROM organizations o
    INNER JOIN organization_closure oc ON o.id = oc.ancestor_id
    WHERE oc.descendant_id = org_id
    ORDER BY oc.depth DESC;
END$$

-- 사용자의 실제 권한 계산 (역할 + 개별 권한)
CREATE PROCEDURE GetUserEffectivePermissions(IN user_id INT)
BEGIN
    -- 역할 기반 권한
    SELECT DISTINCT p.*
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = user_id 
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    
    UNION
    
    -- 개별 부여된 권한
    SELECT DISTINCT p.*
    FROM permissions p
    INNER JOIN user_permissions up ON p.id = up.permission_id
    WHERE up.user_id = user_id 
        AND up.granted = true
        AND (up.expires_at IS NULL OR up.expires_at > NOW());
END$$

-- 디바이스 상태 요약
CREATE PROCEDURE GetDeviceStatusSummary(IN org_id INT DEFAULT NULL)
BEGIN
    IF org_id IS NULL THEN
        -- 전체 요약
        SELECT 
            status,
            COUNT(*) as device_count,
            AVG(battery_level) as avg_battery,
            AVG(signal_strength) as avg_signal
        FROM esl_devices
        GROUP BY status;
    ELSE
        -- 특정 조직 및 하위 조직 요약
        SELECT 
            d.status,
            COUNT(*) as device_count,
            AVG(d.battery_level) as avg_battery,
            AVG(d.signal_strength) as avg_signal
        FROM esl_devices d
        INNER JOIN organization_closure oc ON d.organization_id = oc.descendant_id
        WHERE oc.ancestor_id = org_id
        GROUP BY d.status;
    END IF;
END$$

-- 프로모션 상품 추천
CREATE PROCEDURE GetPromotionRecommendations(
    IN org_id INT,
    IN limit_count INT DEFAULT 10
)
BEGIN
    SELECT 
        p.*,
        COUNT(DISTINCT pt.device_id) as display_count,
        AVG(cu.completed_at - cu.created_at) as avg_update_time
    FROM products p
    LEFT JOIN price_tags pt ON p.id = pt.product_id
    LEFT JOIN content_updates cu ON p.id = cu.product_id AND cu.status = 'completed'
    WHERE p.organization_id IN (
        SELECT descendant_id 
        FROM organization_closure 
        WHERE ancestor_id = org_id
    )
    AND p.is_promotion = true
    AND p.promotion_end_date > NOW()
    GROUP BY p.id
    ORDER BY 
        p.promotion_end_date ASC,
        (p.original_price - p.current_price) / p.original_price DESC
    LIMIT limit_count;
END$$

DELIMITER ;

-- ===============================================
-- 17. 뷰 생성 (추천 뷰)
-- ===============================================

-- 디바이스 상태 대시보드 뷰
CREATE VIEW device_status_dashboard AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.type as organization_type,
    COUNT(DISTINCT d.id) as total_devices,
    SUM(CASE WHEN d.status = 'active' THEN 1 ELSE 0 END) as active_devices,
    SUM(CASE WHEN d.status = 'error' THEN 1 ELSE 0 END) as error_devices,
    SUM(CASE WHEN d.status = 'inactive' THEN 1 ELSE 0 END) as inactive_devices,
    AVG(d.battery_level) as avg_battery_level,
    AVG(d.signal_strength) as avg_signal_strength,
    MIN(d.battery_level) as min_battery_level,
    COUNT(CASE WHEN d.battery_level < 20 THEN 1 END) as low_battery_count,
    MAX(d.last_heartbeat) as last_update
FROM organizations o
LEFT JOIN esl_devices d ON o.id = d.organization_id
GROUP BY o.id, o.name, o.type;

-- 상품 가격 변동 추적 뷰
CREATE VIEW product_price_history AS
SELECT 
    p.id as product_id,
    p.organization_id,
    p.sku,
    p.name as product_name,
    p.current_price,
    p.original_price,
    p.is_promotion,
    cu.created_at as price_updated_at,
    cu.created_by as updated_by_user_id,
    u.full_name as updated_by_name,
    JSON_EXTRACT(sl.details, '$.old_values.current_price') as old_price,
    JSON_EXTRACT(sl.details, '$.new_values.current_price') as new_price
FROM products p
LEFT JOIN content_updates cu ON p.id = cu.product_id AND cu.update_type = 'price'
LEFT JOIN users u ON cu.created_by = u.id
LEFT JOIN system_logs sl ON sl.entity_type = 'product' 
    AND sl.entity_id = p.id 
    AND sl.action = 'product.update'
    AND JSON_EXTRACT(sl.details, '$.fields[0]') = 'current_price'
ORDER BY p.id, cu.created_at DESC;

-- 사용자 활동 요약 뷰
CREATE VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    u.organization_id,
    o.name as organization_name,
    u.last_login,
    COUNT(DISTINCT sl.id) as total_actions,
    COUNT(DISTINCT CASE WHEN sl.action LIKE 'product.%' THEN sl.id END) as product_actions,
    COUNT(DISTINCT CASE WHEN sl.action LIKE 'device.%' THEN sl.id END) as device_actions,
    COUNT(DISTINCT cu.id) as content_updates,
    MAX(sl.created_at) as last_activity
FROM users u
LEFT JOIN organizations o ON u.organization_id = o.id
LEFT JOIN system_logs sl ON u.id = sl.user_id
LEFT JOIN content_updates cu ON u.id = cu.created_by
WHERE u.is_active = true
GROUP BY u.id;

-- 태그 활용도 분석 뷰
CREATE VIEW tag_utilization_analysis AS
SELECT 
    d.id as device_id,
    d.mac_address,
    d.device_type,
    dt.name as template_name,
    dt.layout_type,
    dt.max_tags,
    COUNT(pt.id) as used_tags,
    dt.max_tags - COUNT(pt.id) as available_slots,
    ROUND((COUNT(pt.id) / dt.max_tags) * 100, 2) as utilization_rate,
    SUM(CASE WHEN pt.product_id IS NOT NULL THEN 1 ELSE 0 END) as product_tags,
    SUM(CASE WHEN pt.product_id IS NULL THEN 1 ELSE 0 END) as info_tags
FROM esl_devices d
INNER JOIN device_templates dt ON d.device_template_id = dt.id
LEFT JOIN price_tags pt ON d.id = pt.device_id AND pt.is_active = true
GROUP BY d.id;

-- 실시간 업데이트 모니터링 뷰
CREATE VIEW realtime_update_monitor AS
SELECT 
    cu.id as update_id,
    cu.update_type,
    cu.status,
    cu.retry_count,
    cu.created_at,
    cu.completed_at,
    TIMESTAMPDIFF(SECOND, cu.created_at, IFNULL(cu.completed_at, NOW())) as duration_seconds,
    d.mac_address as device_mac,
    d.location_store,
    p.name as product_name,
    p.sku as product_sku,
    tt.name as template_name,
    u.full_name as created_by_name,
    cu.error_message
FROM content_updates cu
LEFT JOIN esl_devices d ON cu.device_id = d.id
LEFT JOIN products p ON cu.product_id = p.id
LEFT JOIN tag_templates tt ON cu.tag_template_id = tt.id
LEFT JOIN users u ON cu.created_by = u.id
WHERE cu.created_at > NOW() - INTERVAL 24 HOUR
ORDER BY cu.created_at DESC;

-- ===============================================
-- 18. 트리거 생성 (선택적)
-- ===============================================
DELIMITER $$

-- 상품 가격 변경 시 자동으로 content_update 생성
CREATE TRIGGER after_product_price_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.current_price != NEW.current_price THEN
        INSERT INTO content_updates (
            device_id,
            price_tag_id,
            product_id,
            update_type,
            status,
            created_at
        )
        SELECT 
            pt.device_id,
            pt.id,
            NEW.id,
            'price',
            'pending',
            NOW()
        FROM price_tags pt
        WHERE pt.product_id = NEW.id
        AND pt.is_active = true;
    END IF;
END$$

-- 조직 생성 시 자동으로 closure table 업데이트
CREATE TRIGGER after_organization_insert
AFTER INSERT ON organizations
FOR EACH ROW
BEGIN
    -- 자기 자신 참조 추가
    INSERT INTO organization_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.id, NEW.id, 0);
END$$

DELIMITER ;

-- ===============================================
-- 실행 완료 메시지
-- ===============================================
SELECT 'ESL CMS 목업 데이터 생성 완료!' as message;
SELECT COUNT(*) as total_organizations FROM organizations;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_devices FROM esl_devices;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_price_tags FROM price_tags;