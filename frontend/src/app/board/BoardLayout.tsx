// frontend/src/app/components/board/BoardLayout.tsx
'use client';

import styled from 'styled-components';

export const BoardWrapper = styled.div`
  background-color: #2c3e50;
  border-radius: 12px;
  padding: 1.5rem;
  color: #ecf0f1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const BoardHeader = styled.div`
  /* [수정] flexbox를 사용하여 자식 요소들을 정렬합니다. */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #34495e;
  gap: 1rem; /* 제목과 컨트롤 사이의 간격 */
`;

// [추가] 제목과 부제목을 묶어줄 Wrapper
export const BoardTitleWrapper = styled.div``;

export const BoardTitle = styled.h3`
  color: white;
  margin: 0;
`;

export const BoardSubtitle = styled.p`
  color: rgb(228, 236, 236);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #2ecc71;
    font-weight: bold;
  }
`;

export const BoardContent = styled.div`
  overflow-y: auto;
  margin-top: 1rem;
`;

// ... (TableHeader, Column 스타일은 이전과 동일)
export const TableHeader = styled.div`
  display: flex;
  padding: 0 1rem 0.5rem 1rem;
  border-bottom: 1px solid #34495e;
  color: rgb(232, 241, 241);
  font-size: 1rem;
  text-transform: uppercase;
`;

// [추가] GridContainer를 감싸서 아래쪽 여백을 주기 위한 컴포넌트
export const SectionWrapper = styled.div`
  margin-bottom: 2rem; /* 원하는 만큼 간격을 조절하세요. */
`;