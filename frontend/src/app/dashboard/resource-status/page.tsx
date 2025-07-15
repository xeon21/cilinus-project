// 수정: frontend/src/app/dashboard/resource-status/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../../components/layout/Grid';
import DonutChartCard from './DonutChartCard';
import StatusHistoryChart from './StatusHistoryChart';
import InformationCard from './InformationCard';
import AlarmHistoryCard from './AlarmHistoryCard';
import { ResourceLog } from './StatusHistoryChart'; // StatusHistoryChart에서 타입 export 필요

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ecf0f1;
  margin-bottom: 1.5rem;
`;

export default function ResourceStatusPage() {
    const [history, setHistory] = useState<ResourceLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // [수정] 백엔드 API 호출
                const response = await fetch('http://172.16.83.8:3002/resource/history');
                if (!response.ok) {
                    throw new Error('Failed to fetch resource history');
                }
                const data: ResourceLog[] = await response.json();
                setHistory(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // 1분마다 데이터 다시 가져오기
        const interval = setInterval(fetchData, 60000); 

        return () => clearInterval(interval);
    }, []);

    const latestData = history.length > 0 ? history[history.length - 1] : null;

    if (loading) return <DashboardLayout><PageTitle>Loading...</PageTitle></DashboardLayout>;
    if (error) return <DashboardLayout><PageTitle>Error: {error}</PageTitle></DashboardLayout>;

    return (
        <DashboardLayout $padding="1.5rem">
            <PageTitle>SERVER DETAIL OF ESI_SERVER</PageTitle>

            <GridContainer $gap="1.5rem">
                {/* 왼쪽 컬럼 */}
                <GridItem $lg={8}>
                    <GridContainer $gap="1.5rem">
                        <GridItem $lg={6} $xs={12}>
                            <DonutChartCard
                                title="Recent Status"
                                updatedAt={latestData ? new Date(latestData.timestamp).toLocaleTimeString() : 'N/A'}
                                usage={latestData ? Math.round(latestData.memory) : 0}
                                total={7.63}
                                unit="GB"
                                color="#e74c3c"
                            />
                        </GridItem>
                        <GridItem $lg={6} $xs={12}>
                            <DonutChartCard
                                title="Recent Status"
                                updatedAt={latestData ? new Date(latestData.timestamp).toLocaleTimeString() : 'N/A'}
                                usage={latestData ? Math.round(latestData.disk) : 0}
                                total={49.93}
                                unit="GB"
                                color="#2ecc71"
                            />
                        </GridItem>
                        <GridItem $lg={12} $xs={12}>
                            {/* [수정] history 데이터를 props로 전달 */}
                            <StatusHistoryChart history={history} />
                        </GridItem>
                    </GridContainer>
                </GridItem>

                {/* 오른쪽 컬럼 */}
                <GridItem $lg={4}>
                    <GridContainer $gap="1.5rem">
                        <GridItem $lg={12} $xs={12}><InformationCard /></GridItem>
                        <GridItem $lg={12} $xs={12}><AlarmHistoryCard /></GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </DashboardLayout>
    );
}