'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DeviceStatusHeader from './DeviceStatusHeader';
import DeviceStatusTable, { DeviceStatusData } from './DeviceStatusTable';
import axiosInstance from '@/lib/axios';
import styled from 'styled-components';
import { useSort } from '@/hooks/useSort';
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket';

const StatusContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
`;

export default function DeviceStatusPage() {
  const [initialData, setInitialData] = useState<DeviceStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knownDeviceIds, setKnownDeviceIds] = useState<Set<string>>(new Set());
  
  // WebSocket Hook 사용
  const { devices, isConnected, connectionStatus, wsUrl, error: wsError } = useDeviceWebSocket();
  
  // 초기 데이터 로드 (REST API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/device-status');
        console.log('Initial device status data loaded:', response.data);
        console.log('Sample device data:', response.data[0]); // 첫 번째 디바이스 데이터 확인
        setInitialData(response.data);
        // 초기 데이터의 디바이스 ID들을 저장
        setKnownDeviceIds(new Set(response.data.map((d: DeviceStatusData) => d.deviceId)));
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // WebSocket 데이터와 초기 데이터 병합
  const mergedData = useMemo(() => {
    // Map을 사용하여 중복 방지
    const deviceMap = new Map<string, DeviceStatusData>();
    
    // 먼저 초기 데이터를 Map에 추가
    initialData.forEach(device => {
      // deviceId가 없거나 비어있는 데이터는 제외
      if (device.deviceId && String(device.deviceId).trim()) {
        deviceMap.set(String(device.deviceId), device);
      }
    });
    
    // WebSocket으로 받은 실시간 데이터 반영
    devices.forEach((device, deviceId) => {
      // deviceId가 없거나 비어있는 데이터는 제외
      if (!deviceId || !String(deviceId).trim()) return;
      
      const existingDevice = deviceMap.get(deviceId);
      
      if (existingDevice) {
        // 기존 디바이스 업데이트
        const statusMap: { [key: string]: string } = {
          'online': 'active',
          'warning': 'maintenance',
          'offline': 'inactive'
          // ready는 그대로 유지
        };
        
        deviceMap.set(deviceId, {
          ...existingDevice,
          status: device.status === 'ready' ? 'ready' : (statusMap[device.status] || existingDevice.status),
          lastHeartbeat: device.lastHeartbeat,
          lastUpdate: device.lastHeartbeat,
          isRealtime: true, // 실시간 데이터 표시
          isNew: false // 기존 디바이스는 new가 아님
        });
      } else {
        // 새 디바이스 추가 - 실시간으로 연결된 디바이스
        const statusMap: { [key: string]: string } = {
          'online': 'active',
          'warning': 'maintenance',
          'offline': 'inactive'
          // ready는 그대로 유지
        };
        
        deviceMap.set(deviceId, {
          deviceId: String(device.deviceId),
          deviceName: device.metadata?.deviceName as string || String(device.deviceId), // 기본값
          deviceType: device.metadata?.deviceType as string || 'ESL', // metadata에서 가져오거나 기본값
          storeName: device.metadata?.storeName as string || 'Unknown', // metadata에서 가져오거나 기본값
          storeCode: device.metadata?.storeCode as string || 'N/A',
          status: device.status === 'ready' ? 'ready' : (statusMap[device.status] || 'inactive'),
          lastUpdate: device.lastHeartbeat,
          lastHeartbeat: device.lastHeartbeat,
          battery: device.metadata?.battery as number || 0,
          signal: device.metadata?.signal as number || 0,
          signalStrength: device.metadata?.signalStrength as number || 0,
          macAddress: device.metadata?.macAddress as string || 'N/A',
          isRealtime: true,
          isNew: !knownDeviceIds.has(deviceId) // 초기 데이터에 없던 디바이스만 new로 표시
        } as DeviceStatusData);
      }
    });

    // Map을 배열로 변환하여 반환
    return Array.from(deviceMap.values());
  }, [initialData, devices, knownDeviceIds]);

  const { sortedData, requestSort, sortConfig } = useSort<DeviceStatusData>(mergedData, 'deviceId', 'ascending');
  
  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <DeviceStatusHeader />
      
      {/* WebSocket 연결 상태 표시 */}
      {!loading && (
        <ConnectionStatus 
          status={connectionStatus} 
          isConnected={isConnected}
          wsUrl={wsUrl}
          error={wsError}
        />
      )}
      
      {loading ? (
        <StatusContainer>데이터를 불러오는 중...</StatusContainer>
      ) : error ? (
        <StatusContainer>{error}</StatusContainer>
      ) : (
        <DeviceStatusTable 
          data={sortedData}
          requestSort={requestSort}
          sortConfig={sortConfig}
          isRealtimeEnabled={isConnected}
        />
      )}
    </DashboardLayout>
  );
}

// 연결 상태 표시 컴포넌트
const ConnectionStatusContainer = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch (props.$status) {
      case 'connected': return '#f0fdf4';
      case 'connecting': return '#fef3c7';
      case 'disconnected': return '#fef2f2';
      case 'error': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'connected': return '#bbf7d0';
      case 'connecting': return '#fde68a';
      case 'disconnected': return '#fecaca';
      case 'error': return '#fecaca';
      default: return '#e5e7eb';
    }
  }};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  
  ${props => (props.$status === 'error' || props.$status === 'disconnected') && `
    animation: shake 0.5s ease-in-out;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
      20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
  `}
  
  ${props => props.$status === 'connecting' && `
    animation: pulse 1.5s ease-in-out infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}
`;

const StatusDot = styled.div<{ $status: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  
  ${props => props.$status === 'connected' && `
    animation: glow 2s ease-in-out infinite;
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 2px #10b981; }
      50% { box-shadow: 0 0 8px #10b981; }
    }
  `}
  
  ${props => (props.$status === 'error' || props.$status === 'disconnected') && `
    animation: blink 1s ease-in-out infinite;
    
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.3; }
    }
  `}
`;

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  isConnected: boolean;
  wsUrl: string;
  error: string | null;
}

const ServerInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: 0.75rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(107, 114, 128, 0.1);
  border-radius: 1rem;
  font-size: 0.8125rem;
`;

const ServerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
`;

const ErrorMessage = styled.span`
  margin-left: auto;
  color: #dc2626;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, wsUrl, error }) => {
  const statusText = {
    connecting: '실시간 연결 중...',
    connected: '실시간 연결됨',
    disconnected: '실시간 연결 끊김',
    error: '연결 오류'
  };

  // URL에서 호스트와 포트 추출
  const extractHostAndPort = (url: string) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const port = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80');
      return { hostname, port };
    } catch {
      return { hostname: 'unknown', port: '0' };
    }
  };

  const { hostname, port } = extractHostAndPort(wsUrl);

  return (
    <ConnectionStatusContainer $status={status}>
      <StatusDot $status={status} />
      <span>{statusText[status]}</span>
      
      <ServerInfo>
        <ServerIcon>🖥️</ServerIcon>
        <span style={{ color: '#374151', fontWeight: '500' }}>{hostname}</span>
        <span style={{ color: '#6b7280' }}>:</span>
        <span style={{ color: '#3b82f6', fontWeight: '600' }}>{port}</span>
      </ServerInfo>
      
      {status === 'connected' && (
        <span style={{ color: '#059669', marginLeft: '0.75rem', fontSize: '0.8125rem' }}>
          실시간 업데이트 활성화
        </span>
      )}
      
      {(status === 'error' || status === 'disconnected') && error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </ConnectionStatusContainer>
  );
};