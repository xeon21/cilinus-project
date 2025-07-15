'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../components/layout/Card';

const StatCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  color: #95a5a6; /* 회색 톤의 텍스트 */
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Count = styled.span`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
`;

const PercentageContainer = styled.div`
    margin-top: 1rem;
    font-size: 0.875rem;
`;

const Amount = styled.span<{ $isSuccess: boolean }>`
  color: ${props => props.$isSuccess ? '#2ecc71' : '#e74c3c'};
  font-weight: 700;
  margin-right: 0.5rem;
`;

const Label = styled.span`
  color: #95a5a6;
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$color};
  color: white;
  font-size: 1.5rem; /* 아이콘 크기 */
`;


interface StatisticsCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  count: string | number;
  percentage: {
    color: 'success' | 'error';
    amount: string;
    label: string;
  };
}

export default function StatisticsCard({
  icon,
  iconColor,
  title,
  count,
  percentage,
}: StatisticsCardProps) {
  return (
    <Card>
      <StatCardContent>
        <TextContainer>
          <Title>{title}</Title>
          <Count>{count}</Count>
          <PercentageContainer>
            <Amount $isSuccess={percentage.color === 'success'}>{percentage.amount}</Amount>
            <Label>{percentage.label}</Label>
          </PercentageContainer>
        </TextContainer>
        <IconWrapper $color={iconColor}>{icon}</IconWrapper>
      </StatCardContent>
    </Card>
  );
}