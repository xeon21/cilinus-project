// frontend/src/app/dashboard/user-statistics/page.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,PieChart,Pie,Cell } from 'recharts';

// 범용 레이아웃 컴포넌트들을 import 합니다.
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../../components/layout/Grid';

// 범용 카드 컴포넌트들을 import 합니다.
import StatisticsCard from '../StatisticsCard';
import ChartCard from '../ChartCard';

import {SectionWrapper} from '../..//board/BoardLayout';

// Mock 데이터 (이전과 동일)
const barChartData = [
  { name: 'Mon', uv: 50 }, { name: 'Tue', uv: 20 }, { name: 'Wen', uv: 10 },
  { name: 'Thu', uv: 22 }, { name: 'Fri', uv: 5 }, { name: 'Sun', uv: 15 }, { name: 'Sat', uv: 42 },
];
const lineChartData = [
  { name: 'Apr', sales: 50 }, { name: 'May', sales: 300 }, { name: 'Jun', sales: 250 },
  { name: 'Jul', sales: 480 }, { name: 'Aug', sales: 220 }, { name: 'Sep', sales: 200 },
  { name: 'Oct', sales: 250 }, { name: 'Nov', sales: 230 }, { name: 'Dec', sales: 500 },
];


export default function UserStatisticsPage() {
  return (
    // DashboardLayout에 원하는 배경색과 패딩을 props로 전달합니다.
    <DashboardLayout $bgColor="#1c2833" $padding="2rem">
      {/* GridContainer에 아이템 간격을 props로 전달합니다. */}
      <SectionWrapper>
      <GridContainer $gap="0.5rem">

          {/* 통계 카드 섹션 - 각 GridItem에 반응형 크기를 지정합니다. */}
          <GridItem $lg={3} $md={12} $xs={12}>
            <StatisticsCard
              icon={'🧳'}
              iconColor="#34495e"
              title="Bookings"
              count={281}
              percentage={{ color: 'success', amount: '+55%', label: 'than last week' }}
            />
          </GridItem>
          <GridItem $lg={3} $md={12} $xs={12}>
            <StatisticsCard
              icon={'🏠'}
              iconColor="#27ae60"
              title="Revenue"
              count="34k"
              percentage={{ color: 'success', amount: '+1%', label: 'than yesterday' }}
            />
          </GridItem>
          <GridItem $lg={3} $md={12} $xs={12}>
            <StatisticsCard
              icon={'👥'}
              iconColor="#e74c3c"
              title="Followers"
              count="+91"
              percentage={{ color: 'success', amount: '', label: 'Just updated' }}
            />
          </GridItem>
          <GridItem $lg={3} $md={12} $xs={12}>
              {/* 이 카드는 다른 스타일을 적용해봅니다. */}
            <StatisticsCard
              icon={'📈'}
              iconColor="#8e44ad"
              title="Active Users"
              count="1,204"
              percentage={{ color: 'error', amount: '-2%', label: 'than last hour' }}
            />
          </GridItem>
       </GridContainer>
      </SectionWrapper> 
      <SectionWrapper>
         <GridContainer $gap="0.5rem">
          {/* 차트 카드 섹션 */}
          <GridItem $lg={3} $md={12} $xs={12}>
            {/* ChartCard는 내부적으로 Card를 사용하므로 props를 전달할 수 있습니다. */}
            {/* 예: <ChartCard title="..." description="..." bgColor="#ffffff" ...> */}
            <ChartCard title="Website Views" description="Last Campaign Performance">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                  <YAxis stroke="#95a5a6" fontSize={12}/>
                  <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                  <Bar dataKey="uv" fill="#3498db" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </GridItem>

          <GridItem $lg={2} $md={12} $xs={12}>
            <ChartCard title="Daily Sales" description="(+15%) increase in today sales">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineChartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                    <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                    <YAxis stroke="#95a5a6" fontSize={12} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                    <Line type="monotone" dataKey="sales" stroke="#2ecc71" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                  </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </GridItem>

          <GridItem $lg={4} $md={12} $xs={12}>
            <ChartCard title="Completed Tasks" description="Last Campaign Performance">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineChartData.map(d => ({...d, sales: d.sales * Math.random() + 50}))} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                      <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                      <YAxis stroke="#95a5a6" fontSize={12} />
                      <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                      <Line type="monotone" dataKey="sales" stroke="#bdc3c7" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
          </GridItem>

           <GridItem $lg={3} $md={12} $xs={12}>
              <ChartCard title="Total Review" description="(+5%) increase in today reviews">
                <ResponsiveContainer width="100%" height={200}>
                  {/* BarChart를 PieChart로 변경합니다. */}
                  <PieChart>
                    {/* XAxis, YAxis, Bar 대신 Pie 컴포넌트를 사용합니다. */}
                    <Pie
                      data={barChartData}
                      // dataKey는 각 항목의 값을 나타내는 속성입니다.
                      dataKey="uv"
                      // nameKey는 각 항목의 이름을 나타냅니다. (툴팁 등에 표시)
                      nameKey="name"
                      // cx, cy는 차트의 중심 좌표입니다. "50%"는 컨테이너의 중앙을 의미합니다.
                      cx="50%"
                      cy="50%"
                      // innerRadius를 설정하여 도넛 모양을 만듭니다.
                      innerRadius={60}
                      // outerRadius로 파이의 전체 크기를 조절합니다.
                      outerRadius={80}
                      // fill은 기본 색상이지만, 아래 Cell에서 각자 다른 색을 지정합니다.
                      fill="#8884d8"
                      // 파이 조각에 여백을 줍니다.
                      paddingAngle={2}

                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {/* 데이터 개수만큼 Cell을 만들어 각기 다른 색상을 적용할 수 있습니다. */}
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8A2BE2', '#6B8E23', '#00008B', '#FFC0CB', '#00CED1', '#FF8C00', '#DAA520'][index % 7]} />
                      ))}
                    </Pie>
                    {/* 툴팁은 그대로 사용하여 마우스를 올렸을 때 정보를 표시할 수 있습니다. */}
                    <Tooltip wrapperStyle={{ backgroundColor: '#35595e', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
          </GridItem>

        </GridContainer>
      </SectionWrapper>
    </DashboardLayout>
  );
}