'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../../components/layout/Card';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
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

const BarContainer = styled.div`
    margin-bottom: 1.5rem;
`;

const StatusLabel = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #ecf0f1;
`;

const StatusBar = styled.div`
    width: 100%;
    height: 40px;
    background-color: #2c3e50;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
`;

const StatusSegment = styled.div<{ $width: number; $color: string }>`
    width: ${props => props.$width}%;
    height: 100%;
    background-color: ${props => props.$color};
    transition: width 0.3s ease;
    position: relative;
    
    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 45px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 10;
    }
`;

const Legend = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #95a5a6;
`;

const LegendColor = styled.div<{ $color: string }>`
    width: 16px;
    height: 16px;
    background-color: ${props => props.$color};
    border-radius: 3px;
`;

const TotalDevices = styled.div`
    text-align: center;
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #7f8c8d;
`;

interface DeviceStatus {
    status: string;
    count: number;
    percentage: number;
}

interface DeviceStatusBarChartProps {
    data: {
        total: number;
        statusBreakdown: DeviceStatus[];
        timestamp: string;
    } | null;
}

const statusColors: { [key: string]: string } = {
    online: '#2ecc71',
    offline: '#e74c3c',
    warning: '#f39c12',
    error: '#c0392b'
};

export default function DeviceStatusBarChart({ data }: DeviceStatusBarChartProps) {
    if (!data) {
        return (
            <Card>
                <Title>Device Status</Title>
                <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                    Loading device status...
                </div>
            </Card>
        );
    }

    const updatedAt = new Date(data.timestamp).toLocaleTimeString();

    return (
        <Card>
            <Header>
                <Title>Device Status Distribution</Title>
                <UpdatedTime>Updated: {updatedAt}</UpdatedTime>
            </Header>
            
            <BarContainer>
                <StatusBar>
                    {data.statusBreakdown.map((item, index) => (
                        <StatusSegment
                            key={index}
                            $width={item.percentage}
                            $color={statusColors[item.status] || '#95a5a6'}
                            data-tooltip={`${item.status}: ${item.count} devices (${item.percentage}%)`}
                        />
                    ))}
                </StatusBar>
            </BarContainer>

            <Legend>
                {data.statusBreakdown.map((item, index) => (
                    <LegendItem key={index}>
                        <LegendColor $color={statusColors[item.status] || '#95a5a6'} />
                        <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}: {item.count} ({item.percentage}%)</span>
                    </LegendItem>
                ))}
            </Legend>

            <TotalDevices>
                Total Devices: {data.total}
            </TotalDevices>
        </Card>
    );
}