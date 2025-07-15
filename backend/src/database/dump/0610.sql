USE `amazone`;
DROP procedure IF EXISTS `GetMyTreeInfo`;

USE `amazone`;
DROP procedure IF EXISTS `amazone`.`GetMyTreeInfo`;
;

DELIMITER $$
USE `amazone`$$
CREATE  PROCEDURE `GetMyTreeInfo`(
    IN p_userindex INT
)
BEGIN
    
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_user_index INT;
    DECLARE v_tree_index INT;
    DECLARE v_random_amount INT;
    DECLARE v_nursery_idx INT; -- 처리할 planted_tree_mynursury의 idx (삭제용)

    -- 수명이 다한 나무 목록을 가져오는 커서
    DECLARE cur_expired_trees CURSOR FOR
        SELECT idx, UserIndex, TreeIndex
        FROM planted_tree_mynursury
        WHERE EndedTime < NOW();

    -- 커서의 끝을 감지하는 핸들러
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 트랜잭션 시작
    START TRANSACTION;

    OPEN cur_expired_trees;

    read_loop: LOOP
        FETCH cur_expired_trees INTO v_nursery_idx, v_user_index, v_tree_index;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- 1. 각 나무에 대해 랜덤 수량 생성
        SET v_random_amount = FLOOR(RAND() * 3) + 1;

        -- 2. useritem_info에 아이템 INSERT 또는 UPDATE
        INSERT INTO useritem_info (UserIndex, ItemIndex, ItemAmount, ItemCategory)
        VALUES (v_user_index, v_tree_index, v_random_amount, 1)
        ON DUPLICATE KEY UPDATE
            ItemAmount = useritem_info.ItemAmount + v_random_amount; -- 여기서 VALUES() 대신 직접 변수 사용

        -- 3. harvest_nursury_log에 로그 INSERT
        INSERT INTO harvest_nursury_log (UserIndex, ItemIndex, Amount, RegDate)
        VALUES (v_user_index, v_tree_index, v_random_amount, NOW());

    END LOOP;

    CLOSE cur_expired_trees;
    -- 트랜잭션 커밋
    COMMIT;

    -- 생명주기 다한 식물 비활성화 처리 
    UPDATE  planted_tree_mynursury SET isActive = 0 WHERE EndedTime < NOW();
    
	
    -- 메인 위치에 있는 현재 사용자(p_userindex)의 활성 나무 정보 조회 (탄소 배출량 포함)
    WITH TreeDataWithCo2 AS (
        SELECT
            ptm.idPlantedTreeInfo,
            ptm.UserIndex,
            ptm.TreeIndex,
            ptm.X_Position,
            ptm.Y_Position,
            ptm.Plant_Position,
            ptm.plantedTime,
            (
                COALESCE(pti.LIFE1, 0) + COALESCE(pti.LIFE2, 0) +
                COALESCE(pti.LIFE3, 0) + COALESCE(pti.LIFE4, 0)
            ) AS total_lifespan_hours,
            ptm.EndedTime AS treeEndDate, -- EndedTime 컬럼을 직접 사용 (이전 treeRemainDate 역할)
            GREATEST(
                0,
                TIMESTAMPDIFF(HOUR, NOW(), ptm.EndedTime)
            ) AS remaining_lifespan_hours,
            -- 현재 시간당 탄소 배출량 계산 추가
            CASE
                WHEN TIMESTAMPDIFF(HOUR, ptm.plantedTime, NOW()) <= 0 THEN COALESCE(pti.CO2ABS1, 0)
                WHEN pti.LIFE1 IS NULL OR TIMESTAMPDIFF(HOUR, ptm.plantedTime, NOW()) <= pti.LIFE1 THEN COALESCE(pti.CO2ABS1, 0)
                WHEN pti.LIFE2 IS NULL OR TIMESTAMPDIFF(HOUR, ptm.plantedTime, NOW()) <= (COALESCE(pti.LIFE1,0) + pti.LIFE2) THEN COALESCE(pti.CO2ABS2, 0)
                WHEN pti.LIFE3 IS NULL OR TIMESTAMPDIFF(HOUR, ptm.plantedTime, NOW()) <= (COALESCE(pti.LIFE1,0) + COALESCE(pti.LIFE2,0) + pti.LIFE3) THEN COALESCE(pti.CO2ABS3, 0)
                WHEN pti.LIFE4 IS NULL OR TIMESTAMPDIFF(HOUR, ptm.plantedTime, NOW()) <= (COALESCE(pti.LIFE1,0) + COALESCE(pti.LIFE2,0) + COALESCE(pti.LIFE3,0) + pti.LIFE4) THEN COALESCE(pti.CO2ABS4, 0)
                ELSE COALESCE(pti.CO2ABS4, 0)
            END AS current_hourly_co2_absorption
        FROM
            planted_tree_mainpos ptm
        JOIN
            planttree_info pti ON ptm.TreeIndex = pti.IDX
        WHERE
            ptm.UserIndex = p_userindex -- 프로시저 입력 매개변수 사용
            AND ptm.isActive = 1          -- 현재 활성화된 나무만 조회
    )
    SELECT
        td.idPlantedTreeInfo,
        td.UserIndex,
        td.TreeIndex,
        td.X_Position,
        td.Y_Position,
        td.Plant_Position,
        td.plantedTime,
        td.total_lifespan_hours,
        td.treeEndDate,
        td.remaining_lifespan_hours,
        td.current_hourly_co2_absorption -- 계산된 탄소 배출량 반환
    FROM
        TreeDataWithCo2 td;
	
		
END$$

DELIMITER ;
;

