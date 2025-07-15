// frontend/src/app/components/dashboard/ServerStatusCard.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import Board from '../../board/Board';
import {
  TableHeader
} from '../../board/BoardLayout';


const Column = styled.div<{ $flex: number }>`
  flex: ${(props) => props.$flex};
`;

interface ServerStatusCardProps {
  title: string;
  headerControls?: React.ReactNode; // [추가]
  children: React.ReactNode;
}

export default function ServerStatusCard({
  title,
  headerControls, // [추가]
  children,
}: ServerStatusCardProps) {
  return (
    <Board title={title} headerControls={headerControls}>
      <TableHeader>
        <Column $flex={3}>Server Name</Column>
        <Column $flex={2}>Region</Column>
        <Column $flex={1}>Status</Column>
      </TableHeader>
      <div>{children}</div>
    </Board>
  );
}