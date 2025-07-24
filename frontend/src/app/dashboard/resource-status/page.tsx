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
import DeviceStatusBarChart from './DeviceStatusBarChart';
import { ResourceLog } from './StatusHistoryChart'; // StatusHistoryChart에서 타입 export 필요

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ecf0f1;
  margin-bottom: 1.5rem;
`;

export default function ResourceStatusPage() {
    const [history, setHistory] = useState<ResourceLog[]>([]);
    const [deviceStatus, setDeviceStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 백엔드 API 호출 - 리소스 히스토리와 디바이스 상태를 병렬로 조회
                const [historyResponse, deviceResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/history`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/device-status`)
                ]);
                
                if (!historyResponse.ok || !deviceResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const historyData: ResourceLog[] = await historyResponse.json();
                const deviceData = await deviceResponse.json();
                
                setHistory(historyData);
                setDeviceStatus(deviceData);
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
    
    // 실제 메모리 및 스토리지 총 용량 계산 (GB 단위)
    const totalMemoryGB = 16; // 실제 서버의 총 메모리 용량으로 변경 필요
    const totalStorageGB = 1024; // 1TB = 1024GB

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
                                title="Ram Usage"
                                updatedAt={latestData ? new Date(latestData.timestamp).toLocaleTimeString() : 'N/A'}
                                usage={latestData ? Math.round(latestData.memory) : 0}
                                total={totalMemoryGB}
                                unit="GB"
                                color="#e74c3c"
                            />
                        </GridItem>
                        <GridItem $lg={6} $xs={12}>
                            <DonutChartCard
                                title="Storage Usage"
                                updatedAt={latestData ? new Date(latestData.timestamp).toLocaleTimeString() : 'N/A'}
                                usage={latestData ? (latestData.disk / totalStorageGB) * 100 : 0}
                                total={totalStorageGB}
                                unit="GB"
                                color="#2ecc71"
                            />
                        </GridItem>
                        <GridItem $lg={12} $xs={12}>
                            <DeviceStatusBarChart data={deviceStatus} />
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