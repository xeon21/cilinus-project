'use client';

import React, { useState, use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DeviceDetailHeader from '../DeviceDetailHeader';
import DeviceDetailTable, { DeviceDetailData } from '../DeviceDetailTable';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useSort } from '@/hooks/useSort';

export default function DeviceDetailPage({ params }: { params: Promise<{ deviceId: string }> }) {
  const resolvedParams = use(params);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const searchParams = useSearchParams();
  const deviceName = searchParams.get('name') || '';

  const [data, setData] = useState<DeviceDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { sortedData, requestSort, sortConfig } = useSort<DeviceDetailData>(data);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/device-status/price-tag/${resolvedParams.deviceId}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('디바이스 상세 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch device details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [resolvedParams.deviceId, accessToken]);

  if (loading) {
    return (
      <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
        <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <DeviceDetailHeader deviceName={deviceName} deviceId={resolvedParams.deviceId} />
      <DeviceDetailTable 
        data={sortedData} 
        requestSort={requestSort}
        sortConfig={sortConfig}
      />
    </DashboardLayout>
  );
}