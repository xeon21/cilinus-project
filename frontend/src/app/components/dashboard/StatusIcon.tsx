'use client';

import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// 깜빡이는 효과를 위한 keyframes 정의
const blinkAnimation = keyframes`
  50% {
    opacity: 0.2;
  }
`;

// 아이콘을 감싸는 스타일
const IconWrapper = styled.div<{ $isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background-color: ${props => (props.$isActive ? 'rgba(52, 152, 219, 0.2)' : 'rgb(247, 32, 8)')};
  color: ${props => (props.$isActive ? '#3498db' : '#e74c3c')};

  // isActive가 false일 때만 깜빡임 애니메이션 적용
  ${props =>
    !props.$isActive &&
    css`
      animation: ${blinkAnimation} 1.5s linear infinite;
    `}
`;

interface StatusIconProps {
  isActive: boolean;
}

export default function StatusIcon({ isActive }: StatusIconProps) {
  return (
    <IconWrapper $isActive={isActive}>
      💡
    </IconWrapper>
  );
}