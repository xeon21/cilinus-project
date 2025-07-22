# 조직 경로 업데이트 트리거 문제 분석
작업 시간: 2025-01-21

## 작업 대상 쿼리
```sql
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
```

## TODO 목록
1. ✅ 트리거 쿼리 실패 원인 분석
2. ⏳ MySQL 트리거 문법 및 제약사항 확인
3. ⏳ update_organization_path 함수 존재 여부 확인
4. ⏳ 트리거 생성 권한 확인
5. ⏳ 대체 솔루션 제안

## 분석 결과

### 1. 트리거 쿼리 실패 원인 분석
트리거 생성 실패의 주요 원인들:

1. **DELIMITER 문제**
   - 트리거 코드에 `$$` 종료 구분자가 있지만 DELIMITER 선언이 없음
   - MySQL에서는 프로시저나 트리거 생성 시 DELIMITER 변경이 필요

2. **함수 의존성 문제**
   - `update_organization_path(NEW.id, NEW.parent_id)` 함수가 존재하지 않을 가능성
   - 함수가 없으면 트리거 생성 실패

3. **NEW.id 접근 문제**
   - BEFORE INSERT 트리거에서 NEW.id는 아직 할당되지 않았을 수 있음
   - AUTO_INCREMENT인 경우 INSERT 전에는 ID를 알 수 없음

4. **권한 문제**
   - 트리거 생성 권한(TRIGGER privilege)이 없을 수 있음

### 수정된 쿼리 제안
```sql
DELIMITER $$

CREATE TRIGGER trigger_update_org_path 
BEFORE INSERT ON organizations
FOR EACH ROW
BEGIN
    -- BEFORE INSERT에서는 NEW.id가 없으므로 path는 AFTER INSERT에서 업데이트해야 함
    IF NEW.parent_id IS NULL THEN
        SET NEW.level = 0;
        SET NEW.path = '/';  -- 루트 조직의 경우
    ELSE
        SELECT level + 1, CONCAT(path, id, '/') 
        INTO NEW.level, @parent_path
        FROM organizations 
        WHERE id = NEW.parent_id;
        -- path는 AFTER INSERT 트리거에서 설정
    END IF;
END$$

DELIMITER ;
```

### 2. MySQL 트리거 문법 및 제약사항

#### BEFORE INSERT 트리거 제약사항:
1. **AUTO_INCREMENT 컬럼 접근 불가**
   - NEW.id (AUTO_INCREMENT)는 BEFORE INSERT에서 NULL
   - 실제 ID는 INSERT 시점에 할당됨

2. **DELIMITER 필수**
   - 복잡한 트리거는 DELIMITER 변경 필요
   - 트리거 본문에 세미콜론이 있을 때 필수

3. **함수 호출 제약**
   - 트리거에서 호출하는 함수는 미리 정의되어야 함
   - DETERMINISTIC 함수여야 안전

4. **재귀 트리거 금지**
   - 같은 테이블에 대한 DML 불가
   - 무한 루프 방지

#### 올바른 트리거 생성 순서:
1. 필요한 함수 먼저 생성
2. DELIMITER 설정
3. 트리거 생성
4. DELIMITER 복원

### 3. 대체 솔루션

#### 방법 1: AFTER INSERT 트리거 사용
```sql
DELIMITER $$

-- BEFORE INSERT: level만 설정
CREATE TRIGGER before_insert_org_level
BEFORE INSERT ON organizations
FOR EACH ROW
BEGIN
    IF NEW.parent_id IS NULL THEN
        SET NEW.level = 0;
    ELSE
        SELECT level + 1 INTO NEW.level 
        FROM organizations 
        WHERE id = NEW.parent_id;
    END IF;
END$$

-- AFTER INSERT: path 업데이트
CREATE TRIGGER after_insert_org_path
AFTER INSERT ON organizations
FOR EACH ROW
BEGIN
    IF NEW.parent_id IS NULL THEN
        UPDATE organizations 
        SET path = '/' 
        WHERE id = NEW.id;
    ELSE
        UPDATE organizations o1
        JOIN organizations o2 ON o1.parent_id = o2.id
        SET o1.path = CONCAT(o2.path, NEW.id, '/')
        WHERE o1.id = NEW.id;
    END IF;
END$$

DELIMITER ;
```

#### 방법 2: 애플리케이션 레벨에서 처리
- NestJS 서비스에서 트랜잭션으로 처리
- INSERT 후 path 업데이트 쿼리 실행

#### 방법 3: Stored Procedure 사용
```sql
DELIMITER $$

CREATE PROCEDURE insert_organization(
    IN p_name VARCHAR(255),
    IN p_parent_id INT
)
BEGIN
    DECLARE v_level INT;
    DECLARE v_path VARCHAR(255);
    DECLARE v_new_id INT;
    
    -- level 계산
    IF p_parent_id IS NULL THEN
        SET v_level = 0;
        SET v_path = '/';
    ELSE
        SELECT level + 1, path 
        INTO v_level, v_path
        FROM organizations 
        WHERE id = p_parent_id;
    END IF;
    
    -- 조직 삽입
    INSERT INTO organizations (name, parent_id, level) 
    VALUES (p_name, p_parent_id, v_level);
    
    SET v_new_id = LAST_INSERT_ID();
    
    -- path 업데이트
    IF p_parent_id IS NOT NULL THEN
        SET v_path = CONCAT(v_path, v_new_id, '/');
    END IF;
    
    UPDATE organizations 
    SET path = v_path 
    WHERE id = v_new_id;
END$$

DELIMITER ;
```

## 권장사항
1. **AFTER INSERT 트리거 방식** 추천
   - AUTO_INCREMENT ID 문제 해결
   - 로직 분리로 명확성 향상

2. **애플리케이션 레벨 처리** 고려
   - 더 유연한 비즈니스 로직 구현 가능
   - 테스트 용이
   - 디버깅 편리

## 다음 단계
- update_organization_path 함수 정의 확인
- 선택한 방식으로 구현
- 트리거 생성 권한 확인