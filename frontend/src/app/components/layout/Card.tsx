'use client';

import styled from 'styled-components';

interface CardContainerProps {
  $bgColor?: string;     // [수정]
  $padding?: string;    // [수정]
  $shadow?: string;     // [수정]
  $borderRadius?: string;// [수정]
}

const CardContainer = styled.div<CardContainerProps>`
  background-color: ${props => props.$bgColor || '#2c3e50'};            // [수정]
  border-radius: ${props => props.$borderRadius || '12px'};        // [수정]
  padding: ${props => props.$padding || '1.5rem'};                   // [수정]
  box-shadow: ${props => props.$shadow || '0 4px 12px rgba(0, 0, 0, 0.15)'}; // [수정]
  color: #ecf0f1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface CardProps extends CardContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className, ...rest }: CardProps) {
  return <CardContainer className={className} {...rest}>{children}</CardContainer>;
}