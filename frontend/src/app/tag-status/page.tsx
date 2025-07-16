// 생성: frontend/src/app/tag-status/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TagStatusHeader from './TagStatusHeader';
import TagStatusTable, { TagStatusData } from './TagStatusTable'; // [수정] 타입 임포트
import axiosInstance from '@/lib/axios';
import styled from 'styled-components';
import { useSort } from '@/hooks/useSort'; // [추가] useSort 임포트

// [추가] 로딩 및 에러 표시를 위한 컨테이너
const StatusContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
`;

export default function TagStatusPage() {
  const [data, setData] = useState<TagStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // useSort 훅 사용
  const { sortedData, requestSort, sortConfig } = useSort<TagStatusData>(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/tag-status');
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
      <TagStatusHeader />
      {loading ? (
        <StatusContainer>데이터를 불러오는 중...</StatusContainer>
      ) : error ? (
        <StatusContainer>{error}</StatusContainer>
      ) : (
        <TagStatusTable 
          data={sortedData}
          requestSort={requestSort}
          sortConfig={sortConfig} 
        />
      )}
    </DashboardLayout>
  );
}