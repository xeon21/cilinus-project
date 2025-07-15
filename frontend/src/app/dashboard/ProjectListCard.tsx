// frontend/src/app/dashboard/ProjectListCard.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import Board from '../board/Board';
import {
  TableHeader
} from '../board/BoardLayout';


const Column = styled.div<{ $flex: number; $align?: string }>`
  flex: ${(props) => props.$flex};
  text-align: ${(props) => props.$align || 'left'};
`;

interface ProjectListCardProps {
  title: string;
  subtitle: string;
  headerControls?: React.ReactNode; // [추가]
  children: React.ReactNode;
}

export default function ProjectListCard({
  title,
  subtitle,
  headerControls, // [추가]
  children,
}: ProjectListCardProps) {
  return (
    <Board title={title} subtitle={subtitle} headerControls={headerControls}>
      <TableHeader>
        <Column $flex={3}>이름 (한글)</Column>
        <Column $flex={2}>이름 (영문)</Column>
        <Column $flex={2} $align="center">맨 먼쓰</Column>
        <Column $flex={3}>작업 진행</Column>
      </TableHeader>
      <div>{children}</div>
    </Board>
  );
}