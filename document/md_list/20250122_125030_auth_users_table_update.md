# Auth 모듈 users 테이블 스키마 변경 대응 작업

## 작업 일시
2025-01-22 12:50:30

## 작업 내용

### Todo 목록
1. ✅ users 테이블 스키마 변경사항 분석
2. ✅ 백엔드 auth.repository.ts 쿼리 수정
3. ✅ 백엔드 auth.service.ts 로직 수정
4. ✅ JWT 토큰 페이로드 구조 수정
5. ✅ 유저 프로필 조회 기능 완성
6. ✅ 로깅 코드 업데이트
7. ✅ 테스트 및 검증
8. ✅ 작업 내용 문서화 및 저장

### 작업 상세 내용

#### 1. users 테이블 스키마 변경 사항
기존 스키마에서 다음과 같은 변경사항이 있었음:
- `password` → `password_hash`
- `full_name` → `user_name`
- `role_name` 필드 추가 (VARCHAR(80))
- `last_login` 필드 존재

#### 2. auth.repository.ts 수정
- **findUserByEmail 메서드**:
  - 쿼리에서 `password_hash`, `user_name`, `role_name` 필드 조회
  - 반환 객체에 새로운 필드 매핑
  - 쿼리 로깅 추가 (파라미터가 적용된 완성된 쿼리)
  
- **updateLastLogin 메서드 추가**:
  - 로그인 성공 시 last_login 업데이트
  - 쿼리 로깅 포함

#### 3. auth.service.ts 수정
- **validateUser 메서드**:
  - password → password_hash 비교
  - role_name 정보 추가 로깅
  - last_login 업데이트 호출 추가
  - roles 배열이 비어있을 경우 role_name을 기본값으로 사용

- **login 메서드**:
  - JWT payload에 userName, roleName, organizationId 추가
  - 응답에 모든 사용자 정보 포함
  - 상세한 payload 로깅 추가

#### 4. JWT Strategy 수정
- **jwt.strategy.ts**:
  - validate 메서드에서 반환하는 사용자 정보 확장
  - id, email, userName, roleName, organizationId 포함

#### 5. Auth Controller 수정
- **Swagger 문서 업데이트**:
  - 요청 예시: email 기반 로그인
  - 응답 예시: userName, roleName, lastLogin 포함
  - 프로필 조회 응답 스키마 업데이트

- **로깅 강화**:
  - 요청/응답 상세 로깅
  - permissions 개수 표시
  - 에러 발생 시 상세 로깅

### 쿼리 로깅 예시
```sql
-- 사용자 조회
SELECT id, email, password_hash, user_name, role_name, organization_id, is_active, last_login 
FROM users 
WHERE email = 'superadmin@cjfreshway.com' AND is_active = true

-- 역할 조회
SELECT r.name
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = 1

-- last_login 업데이트
UPDATE users SET last_login = NOW() WHERE id = 1
```

### 응답 구조
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "superadmin@cjfreshway.com",
    "userName": "시스템관리자",
    "roleName": "super_admin",
    "organizationId": 1,
    "roles": ["super_admin"],
    "permissions": ["organization.create", "organization.read", ...],
    "lastLogin": "2025-01-22T12:00:00.000Z"
  }
}
```

## 작업 결과
모든 작업이 성공적으로 완료되었습니다. users 테이블의 새로운 스키마에 맞게 인증 모듈이 업데이트되었으며, 로그인 및 프로필 조회 기능이 정상적으로 작동하도록 수정되었습니다.