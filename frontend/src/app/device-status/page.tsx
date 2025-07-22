'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DeviceStatusHeader from './DeviceStatusHeader';
import DeviceStatusTable, { DeviceStatusData } from './DeviceStatusTable';
import axiosInstance from '@/lib/axios';
import styled from 'styled-components';
import { useSort } from '@/hooks/useSort';

const StatusContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
`;

export default function DeviceStatusPage() {
  const [data, setData] = useState<DeviceStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { sortedData, requestSort, sortConfig } = useSort<DeviceStatusData>(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/device-status');
        setData(response.data);
      } catch {
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <DeviceStatusHeader />
      {loading ? (
        <StatusContainer>데이터를 불러오는 중...</StatusContainer>
      ) : error ? (
        <StatusContainer>{error}</StatusContainer>
      ) : (
        <DeviceStatusTable 
          data={sortedData}
          requestSort={requestSort}
          sortConfig={sortConfig} 
        />
      )}
    </DashboardLayout>
  );
}