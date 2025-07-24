'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  tbody tr:hover {
    background-color: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  vertical-align: top;
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    user-select: none;
    font-size: 0.90rem;
    
    &:hover {
      background-color: #f9fafb;
    }
  }

  & > div {
    margin-top: 0.5rem;
  }
`;

const SortIcon = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const Td = styled.td`
  padding: 0.1rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
`;

const CenterTd = styled(Td)`
  text-align: center;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 100px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  color: #6b7280;
  
  &:hover {
    color: #3498db;
  }
`;

const FilterActions = styled.div`
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
`;

const FilterButton = styled.button<{ $reset?: boolean }>`
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    background-color: ${props => props.$reset ? '#f3f4f6' : '#3498db'};
    color: ${props => props.$reset ? '#374151' : 'white'};
    border: 1px solid ${props => props.$reset ? '#d1d5db' : '#3498db'};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  text-align: center;
  min-width: 4.5rem;
  background-color: ${props => {
    switch (props.$status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      case 'ready': return '#3b82f6';
      case 'error': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const TableRow = styled.tr<{ $isNew?: boolean }>`
  position: relative;
  ${props => props.$isNew && `
    animation: newRowHighlight 2s ease-out;
    @keyframes newRowHighlight {
      0% {
        background-color: #dbeafe;
      }
      100% {
        background-color: transparent;
      }
    }
  `}
  
  &:hover {
    background-color: #f9fafb;
  }
`;

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateString;
  }
};

const groupStoreNames = (storeNames: string[]): { [key: string]: string[] } => {
  const groups: { [key: string]: string[] } = {};
  
  storeNames.forEach(storeName => {
    if (!storeName || !storeName.trim()) return;
    
    // 스토어 이름에서 그룹 키 추출 (첫 단어 또는 특정 패턴)
    let groupKey = 'Other';
    
    // 예: "Seoul Store", "Seoul Branch" -> "Seoul"
    // "Gangnam Store", "Gangnam Mall" -> "Gangnam"
    const words = storeName.split(' ');
    if (words.length > 0) {
      const firstWord = words[0];
      // 첫 단어가 영문자로 시작하거나 한글인 경우 그룹 키로 사용
      if (/^[A-Za-z가-힣]/.test(firstWord)) {
        groupKey = firstWord;
      }
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    if (!groups[groupKey].includes(storeName)) {
      groups[groupKey].push(storeName);
    }
  });
  
  // 각 그룹 내에서 정렬
  Object.keys(groups).forEach(key => {
    groups[key].sort();
  });
  
  return groups;
};

export interface DeviceStatusData {
  [key: string]: string | number | boolean | undefined;
  deviceId: string;
  deviceType: string;
  storeName: string;
  status: string;
  lastUpdate: string;
  signal: number;
  deviceName?: string;
  storeCode?: string;
  lastHeartbeat?: string;
  battery?: number;
  signalStrength?: number;
  isRealtime?: boolean;
  isNew?: boolean;
  macAddress?: string;
}

interface DeviceStatusTableProps {
  data: DeviceStatusData[];
  requestSort: (key: keyof DeviceStatusData) => void;
  sortConfig: { key: keyof DeviceStatusData; direction: 'ascending' | 'descending' } | null;
  isRealtimeEnabled?: boolean;
  filters: {
    deviceId: string;
    deviceType: string;
    storeName: string;
    status: string;
    macAddress: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    deviceId: string;
    deviceType: string;
    storeName: string;
    status: string;
    macAddress: string;
  }>>;
  isFiltered: boolean;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  allData: DeviceStatusData[];
}

export default function DeviceStatusTable({ 
  data, 
  requestSort, 
  sortConfig, 
  isRealtimeEnabled = false,
  filters,
  setFilters,
  isFiltered,
  setIsFiltered,
  allData
}: DeviceStatusTableProps) {

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setIsFiltered(true);
  };

  const handleReset = () => {
    setFilters({
      deviceId: '',
      deviceType: '',
      storeName: '',
      status: '',
      macAddress: ''
    });
    setIsFiltered(false);
  };

  
  const getSortIcon = (key: keyof DeviceStatusData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕';
    }
    if (sortConfig.direction === 'ascending') {
      return '▲';
    }
    return '▼';
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <Th>
                <div className="header-content" onClick={() => requestSort('deviceId')}>Device ID <SortIcon>{getSortIcon('deviceId')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterInput 
                    placeholder="Search..." 
                    value={filters.deviceId}
                    onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                  />
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('deviceType')}>Device Type <SortIcon>{getSortIcon('deviceType')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterSelect 
                    value={filters.deviceType} 
                    onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                  >
                    <option value="">All</option>
                    {[...new Set(allData.map(item => item.deviceType).filter(type => type && type.trim()))].map((type, index) => (
                      <option key={`deviceType-${type}-${index}`} value={type}>{type}</option>
                    ))}
                  </FilterSelect>
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('storeName')}>Store Name <SortIcon>{getSortIcon('storeName')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterSelect 
                    value={filters.storeName}
                    onChange={(e) => handleFilterChange('storeName', e.target.value)}
                  >
                    <option value="">All</option>
                    {(() => {
                      const uniqueStoreNames = [...new Set(allData.map(item => item.storeName).filter(name => name && name.trim()))];
                      const groupedStores = groupStoreNames(uniqueStoreNames);
                      const sortedGroups = Object.keys(groupedStores).sort();
                      
                      return sortedGroups.map(group => (
                        <optgroup key={group} label={group}>
                          {groupedStores[group].map((storeName, index) => (
                            <option key={`${group}-${storeName}-${index}`} value={storeName}>
                              {storeName}
                            </option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </FilterSelect>
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('status')}>Status <SortIcon>{getSortIcon('status')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterSelect 
                    value={filters.status} 
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="ready">Ready</option>
                  </FilterSelect>
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('macAddress')}>MAC Address <SortIcon>{getSortIcon('macAddress')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterInput 
                    placeholder="Search..." 
                    value={filters.macAddress}
                    onChange={(e) => handleFilterChange('macAddress', e.target.value)}
                  />
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('lastUpdate')}>Last Update <SortIcon>{getSortIcon('lastUpdate')}</SortIcon></div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('signal')}>Signal % <SortIcon>{getSortIcon('signal')}</SortIcon></div>
            </Th>
            <Th style={{ minWidth: '150px' }}>
              <div className="header-content">Actions</div>
              <div>
                <FilterActions>
                  <FilterButton onClick={handleSearch}>Search</FilterButton>
                  <FilterButton $reset onClick={handleReset}>Reset</FilterButton>
                </FilterActions>
              </div>
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow key={row.deviceId} $isNew={row.isNew}>
              <Td>{row.deviceId}</Td>
              <Td>{row.deviceType}</Td>
              <Td>{row.storeName}</Td>
              <Td>
                <StatusBadge $status={row.status as string}>
                  {row.status === 'active' && 'active'}
                  {row.status === 'inactive' && 'inactive'}
                  {row.status === 'maintenance' && 'maintenance'}
                  {row.status === 'ready' && 'ready'}
                  {row.status === 'error' && 'error'}
                </StatusBadge>
              </Td>
              <Td>{row.macAddress || 'N/A'}</Td>
              <Td>{formatDateTime(row.lastUpdate)}</Td>
              <CenterTd>{row.signal}%</CenterTd>
              <Td>
                <Link href={`/device-status/detail/${row.deviceId}?store=${encodeURIComponent(row.storeName)}`} passHref>
                  <ActionButton>🔍</ActionButton>
                </Link>
              </Td>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}