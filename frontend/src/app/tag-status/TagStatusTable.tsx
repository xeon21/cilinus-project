// 수정: frontend/src/app/tag-status/TagStatusTable.tsx

'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link'; // [추가] Next.js Link 임포트

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem; /* 패딩 조정 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto; /* 테이블이 넓을 경우 가로 스크롤 */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap; /* 셀 내용이 줄바꿈되지 않도록 */
   /* --- [추가] tbody의 tr에 hover 효과 적용 --- */
  tbody tr:hover {
    background-color: #f9fafb; /* 또는 #f0f8ff 등 원하는 색상 */
  }
  /* --- */
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
    font-size: 0.90rem; /* 50% 크게: 0.75rem * 1.5 = 1.125rem */
    
    &:hover {
      background-color: #f9fafb;
    }
  }

  & > div {
    margin-top: 0.5rem;
  }
`;

// [추가] 정렬 아이콘 스타일
const SortIcon = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;


const Td = styled.td`
  padding: 0.1rem 1rem; /* 패딩 조정 */
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
  min-width: 100px; /* 최소 너비 지정 */
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

// --- [수정] 타입 및 Props 인터페이스 확장 ---
export interface TagStatusData {
  companyName: string;
  companyCode: string;
  storeName: string;
  storeCode: string;
  total: number;
  ok: number;
  wip: number;
  ng: number;
}

interface TagStatusTableProps {
  data: TagStatusData[];
  requestSort: (key: keyof TagStatusData) => void;
  sortConfig: { key: keyof TagStatusData; direction: 'ascending' | 'descending' } | null;
}

export default function TagStatusTable({ data, requestSort, sortConfig }: TagStatusTableProps) {
  // 필터 상태 관리
  const [filters, setFilters] = useState({
    companyName: '',
    companyCode: '',
    storeName: '',
    storeCode: ''
  });

  const [filteredData, setFilteredData] = useState(data);

  // 필터 입력 변경 핸들러
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 검색 기능
  const handleSearch = () => {
    const filtered = data.filter(item => {
      return (
        (filters.companyName === '' || item.companyName === filters.companyName) &&
        (filters.companyCode === '' || item.companyCode === filters.companyCode) &&
        (filters.storeName === '' || item.storeName.toLowerCase().includes(filters.storeName.toLowerCase())) &&
        (filters.storeCode === '' || item.storeCode.toLowerCase().includes(filters.storeCode.toLowerCase()))
      );
    });
    setFilteredData(filtered);
  };

  // 리셋 기능
  const handleReset = () => {
    setFilters({
      companyName: '',
      companyCode: '',
      storeName: '',
      storeCode: ''
    });
    setFilteredData(data);
  };

  // data prop이 변경될 때 filteredData 업데이트
  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);
  
    // [추가] 정렬 아이콘 렌더링 함수
  const getSortIcon = (key: keyof TagStatusData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕'; // 기본 (정렬 안됨)
    }
    if (sortConfig.direction === 'ascending') {
      return '▲'; // 오름차순
    }
    return '▼'; // 내림차순
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          {/* --- [핵심 수정] 필터 행을 제거하고 각 Th 안에 필터 요소를 포함 --- */}
          <tr>
            {/* --- [수정] 각 Th에 onClick 이벤트와 아이콘 추가 --- */}
            <Th>
                <div className="header-content" onClick={() => requestSort('companyName')}>Company Name <SortIcon>{getSortIcon('companyName')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterSelect 
                    value={filters.companyName} 
                    onChange={(e) => handleFilterChange('companyName', e.target.value)}
                  >
                    <option value="">All</option>
                    {[...new Set(data.map(item => item.companyName))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </FilterSelect>
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('companyCode')}>Company Code <SortIcon>{getSortIcon('companyCode')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterSelect 
                    value={filters.companyCode} 
                    onChange={(e) => handleFilterChange('companyCode', e.target.value)}
                  >
                    <option value="">All</option>
                    {[...new Set(data.map(item => item.companyCode))].map(code => (
                      <option key={code} value={code}>{code}</option>
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
                <div className="header-content" onClick={() => requestSort('storeCode')}>Store Code <SortIcon>{getSortIcon('storeCode')}</SortIcon></div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FilterInput 
                    placeholder="Search..." 
                    value={filters.storeCode}
                    onChange={(e) => handleFilterChange('storeCode', e.target.value)}
                  />
                </div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('total')}>Total Tag Cnt <SortIcon>{getSortIcon('total')}</SortIcon></div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('ok')}>OK Tag Cnt <SortIcon>{getSortIcon('ok')}</SortIcon></div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('wip')}>WIP Tag Cnt <SortIcon>{getSortIcon('wip')}</SortIcon></div>
            </Th>
            <Th>
                <div className="header-content" onClick={() => requestSort('ng')}>NG Tag Cnt<SortIcon>{getSortIcon('ng')}</SortIcon></div>
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
              <Td>{row.companyName}</Td>
              <Td>{row.companyCode}</Td>
              <Td>{row.storeName}</Td>
              <Td>{row.storeCode}</Td>
              <CenterTd>{row.total}</CenterTd>
              <CenterTd>{row.ok}</CenterTd>
              <CenterTd>{row.wip}</CenterTd>
              <CenterTd>{row.ng}</CenterTd>
              <Td>
                <Link href={`/tag-status/detail/${row.storeCode}?name=${encodeURIComponent(row.storeName)}`} passHref>
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