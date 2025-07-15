// 수정: frontend/src/app/tag-status/detail/[storeCode]/page.tsx

'use client';

import React, { useState, use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import TagDetailHeader from '../TagDetailHeader';
import TagDetailTable, { TagDetailData } from '../TagDetailTable';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useSort } from '@/hooks/useSort';

export default function TagDetailPage({ params }: { params: Promise<{ storeCode: string }> }) {
  const resolvedParams = use(params);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const searchParams = useSearchParams();
  const storeName = searchParams.get('name') || '';

  const [data, setData] = useState<TagDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // useSort 훅 사용
  const { sortedData, requestSort, sortConfig } = useSort<TagDetailData>(data);

  useEffect(() => {
    const fetchTagDetails = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/tag-status/detail/${resolvedParams.storeCode}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('태그 상세 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch tag details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTagDetails();
  }, [resolvedParams.storeCode, accessToken]);

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
      <TagDetailHeader storeName={storeName} storeCode={resolvedParams.storeCode} />
      <TagDetailTable 
        data={sortedData} 
        requestSort={requestSort}
        sortConfig={sortConfig}
      />
    </DashboardLayout>
  );
}