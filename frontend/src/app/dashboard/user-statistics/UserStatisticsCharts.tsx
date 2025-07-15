// frontend/src/app/dashboard/user-statistics/UserStatisticsCharts.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { 
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const mockServerData = [
  { locationName: '서울', Amount: '50' }, { locationName: '인천', Amount: '60' },
  { locationName: '수원', Amount: '30' }, { locationName: '부천', Amount: '33' },
  { locationName: '춘천', Amount: '33' }, { locationName: '부산', Amount: '20' },
  { locationName: '전주', Amount: '55' }, { locationName: '대전', Amount: '113' },
];

const chartData = mockServerData.map(item => ({
  name: item.locationName,
  value: parseInt(item.Amount, 10),
}));

const COLORS = ['#8A2BE2', '#6B8E23', '#00008B', '#FFC0CB', '#00CED1', '#FF8C00', '#DAA520', '#FF6347'];

const ChartPageContainer = styled.div`
  width: 100%;
  max-width: 1080px; 
  margin: 2rem auto;
  padding: 2rem;
  background-color: #FAEBD7;
  border-radius: 1rem;
  font-family: sans-serif;
`;

const ChartTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #5a4b41;
  margin-bottom: 3rem;
  font-style: italic;
`;

const ChartsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const SingleChartContainer = styled.div`
  width: 100%;
  
  @media (min-width: 1024px) {
    width: calc(50% - 1rem);
  }
`;

const ChartLabel = styled.p`
  text-align: center;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

export default function UserStatisticsCharts() {
  const data = chartData;

  return (
    <>
      <ChartsWrapper>
        <SingleChartContainer>
          <ChartLabel>지역별 분포 (도넛)</ChartLabel>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                /* --- [수정] innerRadius 속성을 추가하여 도넛 형태로 변경 --- */
                innerRadius={60} 
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </SingleChartContainer>

        <SingleChartContainer>
          <ChartLabel>지역별 분포 (막대)</ChartLabel>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="수량">
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SingleChartContainer>
      </ChartsWrapper>

       <ResponsiveContainer width="100%" height={50}>
            <Legend wrapperStyle={{ top: 20, left: 0, right: 0 }} />
       </ResponsiveContainer>
    </>
  );
}