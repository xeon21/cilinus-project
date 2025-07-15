// 생성: frontend/src/app/dashboard/resource-status/DonutChartCard.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Card from '../../components/layout/Card';

const ChartWrapper = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;

  .percentage {
    font-size: 2.5rem;
    font-weight: 700;
  }

  .usage {
    font-size: 0.875rem;
    color: #95a5a6;
  }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const Title = styled.h4`
  color: #ecf0f1;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
`;

const UpdatedTime = styled.span`
    font-size: 0.8rem;
    color: #7f8c8d;
`;

interface DonutChartCardProps {
  title: string;
  updatedAt: string;
  usage: number; // 사용량 (0 ~ 100)
  total: number;
  unit: 'GB' | 'TB';
  color: string;
}

export default function DonutChartCard({ title, updatedAt, usage, total, unit, color }: DonutChartCardProps) {
  const used = (total * usage) / 100;
  const data = [
    { name: 'Used', value: usage },
    { name: 'Free', value: 100 - usage },
  ];
  const COLORS = [color, '#34495e'];

  return (
    <Card>
        <Header>
            <Title>{title}</Title>
            <UpdatedTime>Updated: {updatedAt}</UpdatedTime>
        </Header>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={'70%'}
              outerRadius={'90%'}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <CenterLabel>
          <div className="percentage">{`${usage}%`}</div>
          <div className="usage">{`${used.toFixed(1)} / ${total} ${unit}`}</div>
        </CenterLabel>
      </ChartWrapper>
    </Card>
  );
}