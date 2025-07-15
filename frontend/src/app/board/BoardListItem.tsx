// frontend/src/app/components/board/BoardListItem.tsx
'use client';

import styled from 'styled-components';

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #34495e;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #34495e;
  }
`;

export const Column = styled.div<{ $flex: number; $align?: string }>`
  flex: ${(props) => props.$flex};
  padding: 0 1rem;
  color: rgb(172, 177, 179);
  font-size: 0.83rem;
  font-weight: 400;
  text-align: ${(props) => props.$align || 'left'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;