// frontend/src/app/components/board/Board.tsx
'use client';

import React from 'react';
import {
  BoardWrapper,
  BoardHeader,
  BoardTitleWrapper,
  BoardTitle,
  BoardSubtitle,
  BoardContent,
} from './BoardLayout';

interface BoardProps {
  title: string;
  subtitle?: string;
  headerControls?: React.ReactNode; // 헤더 컨트롤을 위한 prop
  children: React.ReactNode;
}

export default function Board({ title, subtitle, headerControls, children }: BoardProps) {
  return (
    <BoardWrapper>
      <BoardHeader>
        <BoardTitleWrapper>
          <BoardTitle>{title}</BoardTitle>
         
          {subtitle && (
            <BoardSubtitle>
              <span>✔️</span> {subtitle}
            </BoardSubtitle>
          )}
        </BoardTitleWrapper> 
        {/* [수정] headerControls가 존재할 때 렌더링하도록 수정 */}
        {headerControls && <div>{headerControls}</div>}
      </BoardHeader>
      <BoardContent>{children}</BoardContent>
    </BoardWrapper>
  );
}