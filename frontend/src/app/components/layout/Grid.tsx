// frontend/src/app/components/layout/Grid.tsx
'use client';
import styled from 'styled-components';

interface GridContainerProps {
  $gap?: string;
}

export const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  /* 12개의 동일한 너비의 컬럼을 생성합니다. */
  grid-template-columns: repeat(12, 1fr);
  /* grid 레이아웃에서 gap은 아이템 사이의 간격을 완벽하게 처리합니다. */
  gap: ${(props) => props.$gap || '1.5rem'};
`;

interface GridItemProps {
  $lg?: number;
  $md?: number;
  $xs?: number;
}

export const GridItem = styled.div<GridItemProps>`
  /* 기본 (가장 작은 화면) 설정: 12칸 전체를 차지 */
  grid-column: span ${(props) => props.$xs || 12};

  /* 중간 크기 화면 (900px 이상) */
  @media (min-width: 900px) {
    grid-column: span ${(props) => props.$md || props.$xs || 12};
  }

  /* 큰 화면 (1200px 이상) */
  @media (min-width: 1200px) {
    grid-column: span ${(props) => props.$lg || props.$md || props.$xs || 12};
  }
`;