# Project Repository Update

## 작업 일시
2025-07-22 10:17:02

## 작업 내용
backend/src/project/project.repository.ts 파일에서 user_info 테이블 참조를 현재 DB 스키마의 users 테이블에 맞게 수정

## TODO 목록
1. ✅ document/cilinus.sql에서 최신 users 테이블 스키마 확인
2. ✅ project.repository.ts에서 user_info 테이블 참조 부분 파악
3. ✅ users 테이블 스키마에 맞게 쿼리 수정
4. ✅ logger에 쿼리 로깅 추가
5. ✅ 작업 결과를 MD 파일로 문서화

## 작업 상세

### 1. DB 스키마 분석 결과
현재 users 테이블 구조:
- id (PK)
- organization_id
- email
- password_hash
- role_name
- is_active
- last_login
- created_at
- updated_at
- user_name

**주의**: user_info 테이블은 존재하지 않음

### 2. 변경 사항

#### 2.1 테이블명 변경
- `user_info` → `users`

#### 2.2 컬럼명 변경
- `UserIdx` → `id`
- `username` → `user_name`

#### 2.3 수정된 쿼리
1. Count Query:
   ```sql
   -- 변경 전
   SELECT count(*) as total FROM projects p LEFT JOIN user_info u ON p.userId = u.UserIdx
   
   -- 변경 후
   SELECT count(*) as total FROM projects p LEFT JOIN users u ON p.userId = u.id
   ```

2. Data Query:
   ```sql
   -- 변경 전
   SELECT p.id, p.name, p.createdAt, p.updatedAt, p.thumbnail, u.username as author 
   FROM projects p
   LEFT JOIN user_info u ON p.userId = u.UserIdx
   
   -- 변경 후
   SELECT p.id, p.name, p.createdAt, p.updatedAt, p.thumbnail, u.user_name as author 
   FROM projects p
   LEFT JOIN users u ON p.userId = u.id
   ```

3. Where Clause:
   ```typescript
   // 변경 전
   whereClauses.push('u.username LIKE ?');
   
   // 변경 후
   whereClauses.push('u.user_name LIKE ?');
   ```

### 3. Logger 추가
winston logger를 import하여 완성된 쿼리를 로깅하도록 추가:
- count query 로깅
- data query 로깅

각 쿼리는 파라미터가 적용된 완성된 형태로 로깅됩니다.

## 작업 완료
모든 TODO 항목이 성공적으로 완료되었습니다.