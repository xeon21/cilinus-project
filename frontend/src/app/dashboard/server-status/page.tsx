'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

// 범용 레이아웃 및 새로 만든 컴포넌트 import
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../../components/layout/Grid';
import ServerStatusCard from '../../components/dashboard/ServerStatusCard';
import ServerStatusListItem from '../../components/dashboard/ServerStatusListItem';

interface ServerStatus {
  serverName: string;
  regeion: string; // 'region'의 오타로 보이지만, 기존 API 응답을 따릅니다.
  serverStatus: string;
}

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ecf0f1;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #4a627a;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
  background-color: #2c3e50;
  color: white;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  transition: background-color 0.15s;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingOrErrorContainer = styled.div`
    padding: 4rem;
    text-align: center;
    color: #95a5a6;
    width: 100%;
`;

export default function ServerStatusPage() {
  console.log('ServerStatusPage component rendered');
  
  const accessToken = useAuthStore((state) => state.accessToken);
  const [levelInput, setLevelInput] = useState<string>('1');
  const [apiParam, setApiParam] = useState<string>('1');
  const [data, setData] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Current accessToken:', accessToken);

  const fetchData = async (param: string) => {
    console.log('fetchData called with param:', param);
    
    if (!accessToken) {
      console.log('No access token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching server status with param: ${param}`);
      const response = await axiosInstance.get(`/Game/getServerStatus/${param}`);
      console.log('Server status response:', response.data);
      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (e: any) {
      console.error('Server Status API Error:', e);
      setError(e.response?.data?.message || e.message || '서버 상태를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, accessToken:', accessToken);
    // 페이지 로드 시 기본값으로 데이터 fetch
    if (accessToken) {
      fetchData(apiParam);
    }
  }, [accessToken]); // accessToken이 있을 때만 실행

  const handleSearch = () => {
    setApiParam(levelInput);
    fetchData(levelInput);
  };

  return (
    <DashboardLayout $bgColor="#1c2833">
      <GridContainer>
        <GridItem $lg={6} $md={12} $xs={12}>
          <ControlsContainer>
            <PageTitle>Server Status</PageTitle>
            <div>
              <SearchInput
                type="number"
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value)}
                placeholder="서버 ID 입력"
              />
              <SearchButton onClick={handleSearch}>조회</SearchButton>
            </div>
          </ControlsContainer>
        </GridItem>
      </GridContainer>
      
      <GridContainer>
        <GridItem $lg={6} $md={12} $xs={12}>
          {loading ? (
            <LoadingOrErrorContainer>데이터를 불러오는 중입니다...</LoadingOrErrorContainer>
          ) : error ? (
            <LoadingOrErrorContainer>데이터 로딩 중 오류가 발생했습니다: {error}</LoadingOrErrorContainer>
          ) : (
            <ServerStatusCard title="서버 목록">
              {data.map((server, index) => (
                <ServerStatusListItem
                  key={index}
                  serverName={server.serverName}
                  region={server.regeion}
                  status={server.serverStatus}
                />
              ))}
            </ServerStatusCard>
          )}
        </GridItem>
        
        <GridItem $lg={6} $md={12} $xs={12}>
          <ServerStatusCard title="추가 정보">
            {/* 여기에 새로운 테이블이나 컨텐츠를 추가할 수 있습니다 */}
            <div style={{ padding: '1rem', color: '#95a5a6' }}>
              <p>서버 통계나 다른 정보를 여기에 표시할 수 있습니다.</p>
              <ul style={{ marginTop: '1rem' }}>
                <li>총 서버 수: {data.length}</li>
                <li>정상 서버: {data.filter(s => s.serverStatus === '1').length}</li>
                <li>오류 서버: {data.filter(s => s.serverStatus === '0').length}</li>
              </ul>
            </div>
          </ServerStatusCard>
        </GridItem>
      </GridContainer>
    </DashboardLayout>
  );
}