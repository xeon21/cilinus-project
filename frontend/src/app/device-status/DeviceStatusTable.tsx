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
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    switch (props.$status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
`;

export interface DeviceStatusData {
  [key: string]: string | number;
  deviceId: string;
  deviceType: string;
  storeName: string;
  status: string;
  lastUpdate: string;
  signal: number;
}

interface DeviceStatusTableProps {
  data: DeviceStatusData[];
  requestSort: (key: keyof DeviceStatusData) => void;
  sortConfig: { key: keyof DeviceStatusData; direction: 'ascending' | 'descending' } | null;
}

export default function DeviceStatusTable({ data, requestSort, sortConfig }: DeviceStatusTableProps) {
  const [filters, setFilters] = useState({
    deviceId: '',
    deviceType: '',
    storeName: '',
    status: ''
  });

  const [filteredData, setFilteredData] = useState(data);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const filtered = data.filter(item => {
      return (
        (filters.deviceId === '' || item.deviceId.toLowerCase().includes(filters.deviceId.toLowerCase())) &&
        (filters.deviceType === '' || item.deviceType === filters.deviceType) &&
        (filters.storeName === '' || item.storeName.toLowerCase().includes(filters.storeName.toLowerCase())) &&
        (filters.status === '' || item.status === filters.status)
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setFilters({
      deviceId: '',
      deviceType: '',
      storeName: '',
      status: ''
    });
    setFilteredData(data);
  };

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);
  
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
                    {[...new Set(data.map(item => item.deviceType))].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </FilterSelect>
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('storeName')}>Store Name <SortIcon>{getSortIcon('storeName')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterInput 
                    placeholder="Search..." 
                    value={filters.storeName}
                    onChange={(e) => handleFilterChange('storeName', e.target.value)}
                  />
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
                  </FilterSelect>
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
          {filteredData.map((row, index) => (
            <tr key={index}>
              <Td>{row.deviceId}</Td>
              <Td>{row.deviceType}</Td>
              <Td>{row.storeName}</Td>
              <Td>
                <StatusBadge $status={row.status as string}>{row.status}</StatusBadge>
              </Td>
              <Td>{row.lastUpdate}</Td>
              <CenterTd>{row.signal}%</CenterTd>
              <Td>
                <Link href={`/device-status/detail/${row.deviceId}?store=${encodeURIComponent(row.storeName)}`} passHref>
                  <ActionButton>🔍</ActionButton>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}