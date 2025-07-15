'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../components/layout/Card';

const ChartCardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h4`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
`;

const Description = styled.p`
  color: #95a5a6;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ChartContainer = styled.div`
    flex-grow: 1; /* 남은 공간을 모두 차지하도록 함 */
    width: 100%;
`;


interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode; // 차트 컴포넌트를 자식으로 받습니다.
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card>
      <ChartCardHeader>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </ChartCardHeader>
      <ChartContainer>
        {children}
      </ChartContainer>
    </Card>
  );
}