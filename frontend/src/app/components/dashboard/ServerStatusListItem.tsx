// frontend/src/app/components/dashboard/ServerStatusListItem.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import StatusIcon from './StatusIcon';
// 새로 만든 BoardListItem의 스타일 컴포넌트를 임포트합니다.
import {
  ItemRow,
  Column,
} from '../../board/BoardListItem';

const ServerNameColumn = styled(Column)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ecf0f1;
  font-weight: 500;
`;

interface ServerStatusListItemProps {
  serverName: string;
  region: string;
  status: string;
}

export default function ServerStatusListItem({
  serverName,
  region,
  status,
}: ServerStatusListItemProps) {
  const isActive = status === '1';

  return (
    <ItemRow>
      <ServerNameColumn $flex={3}>{serverName}</ServerNameColumn>
      <Column $flex={2}>{region}</Column>
      <Column $flex={1}>
        <StatusIcon isActive={isActive} />
      </Column>
    </ItemRow>
  );
}