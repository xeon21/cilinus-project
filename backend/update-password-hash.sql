-- 테스트용 비밀번호 해시 업데이트 SQL
-- 비밀번호: password123
-- bcrypt 해시: $2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu

-- 모든 사용자의 비밀번호를 'password123'으로 설정
UPDATE users 
SET password_hash = '$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu'
WHERE 1=1;

-- 특정 사용자만 업데이트하려면
-- UPDATE users 
-- SET password_hash = '$2b$10$cF5TzopLRcJhUlHjOpbJxOWCnVUCFl5jTAGih4VSWqidBqCwxTROu'
-- WHERE email = 'superadmin@cjfreshway.com';

-- 확인
SELECT id, email, user_name, role_name, password_hash 
FROM users 
WHERE email = 'superadmin@cjfreshway.com';