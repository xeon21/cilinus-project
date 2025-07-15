// 생성: frontend/src/app/tag-status/TagStatusHeader.tsx

'use client';

import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => (props.$primary ? '#e67e22' : '#d1d5db')};
  background-color: ${props => (props.$primary ? '#e67e22' : 'white')};
  color: ${props => (props.$primary ? 'white' : '#374151')};

  &:hover {
    opacity: 0.9;
  }
`;

export default function TagStatusHeader() {
  return (
    <HeaderWrapper>
      <Title>TAG STATUS BY STORE</Title>
      <ControlsWrapper>
        <Select>
          <option>STORE LIST</option>
        </Select>
        <Button>Save Filter</Button>
        <Select>
          <option>TAG TYPE</option>
        </Select>
        <Button $primary>Actions</Button>
      </ControlsWrapper>
    </HeaderWrapper>
  );
}