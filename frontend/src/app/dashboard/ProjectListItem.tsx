// frontend/src/app/dashboard/ProjectListItem.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
// 새로 만든 BoardListItem의 스타일 컴포넌트를 임포트합니다.
import {
  ItemRow,
  Column,
} from '../board/BoardListItem';

const CompanyColumn = styled(Column)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ecf0f1;
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #34495e;
  border-radius: 3px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: ${(props) => props.$progress}%;
  height: 100%;
  background-color: rgb(202, 60, 179);
  border-radius: 3px;
`;

interface ProjectListItemProps {
  nameKr: string;
  nameEn: string;
  co2: number;
  life: number;
}

export default function ProjectListItem({
  nameKr,
  nameEn,
  co2,
  life,
}: ProjectListItemProps) {
  const completion = (life / 24) * 100;
  const completion2 = Math.random() * 100;

  return (
    <ItemRow>
      <CompanyColumn $flex={3}>
        <span>{nameKr}</span>
      </CompanyColumn>
      <Column $flex={2}>{nameEn}</Column>
      <Column $flex={2} $align="center">
        {co2.toFixed(3)}
      </Column>
      <Column $flex={3}>
        <ProgressBarContainer>
          <ProgressBar $progress={completion2} />
        </ProgressBarContainer>
      </Column>
    </ItemRow>
  );
}