// 수정: frontend/src/app/tag-status/detail/TagDetailTable.tsx

'use client';

import React from 'react';
import styled from 'styled-components';

// --- Styled Components (기존과 유사, 일부 수정) ---

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const ControlGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
`;

const ActionButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
`;

const Th = styled.th`
  cursor: pointer;
  user-select: none; 
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  vertical-align: top;
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;


const SortIcon = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const Td = styled.td`
  padding: 0.4rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  text-align: center;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 80px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const FilterActions = styled.div`
    display: flex;
    gap: 0.5rem;
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

const EmptyTableMessage = styled.div`
    text-align: center;
    color: #6b7280;
    padding: 3rem;
    border-top: 1px solid #e5e7eb;
`;

// --- [추가/수정] 타입 및 Props 인터페이스 ---
export interface TagDetailData {
    id: string;
    prCode: string;
    tagType: string;
    gwIp: string;
    operation: string;
    status: string;
    version: string;
    rssi: number;
    battery: number;
    temperature: number;
    transmissionTime: string;
    receivingTime: string;
}


interface TagDetailTableProps {
  data: TagDetailData[];
  requestSort: (key: keyof TagDetailData) => void;
  sortConfig: { key: keyof TagDetailData; direction: 'ascending' | 'descending' } | null;
}
// ---

export default function TagDetailTable({ data, requestSort, sortConfig }: TagDetailTableProps) {

  const getSortIcon = (key: keyof TagDetailData) => {
    if (!sortConfig || sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };
  
  return (
    <TableContainer>
        <Controls>
            <ControlGroup>
                <span>TAG LIST</span>
                <button>Save Filter</button>
                <button>TAG TYPE</button>
            </ControlGroup>
            <ActionButton>Actions</ActionButton>
        </Controls>
        <StyledTable>
            <thead>
               <tr>
                    <Th><input type="checkbox" /></Th>
                    {/* --- [수정] 각 헤더에 정렬 기능 적용 --- */}
                    <Th onClick={() => requestSort('id')}><div className="header-content">Tag ID <SortIcon>{getSortIcon('id')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('prCode')}><div className="header-content">PrCode <SortIcon>{getSortIcon('prCode')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('tagType')}><div className="header-content">Tag Type <SortIcon>{getSortIcon('tagType')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('gwIp')}><div className="header-content">G/W IP <SortIcon>{getSortIcon('gwIp')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('operation')}><div className="header-content">Operation <SortIcon>{getSortIcon('operation')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('status')}><div className="header-content">Status <SortIcon>{getSortIcon('status')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('version')}><div className="header-content">Version <SortIcon>{getSortIcon('version')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('rssi')}><div className="header-content">RSSI <SortIcon>{getSortIcon('rssi')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('battery')}><div className="header-content">Battery <SortIcon>{getSortIcon('battery')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('temperature')}><div className="header-content">Temperature <SortIcon>{getSortIcon('temperature')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('transmissionTime')}><div className="header-content">Transmission Time <SortIcon>{getSortIcon('transmissionTime')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('receivingTime')}><div className="header-content">Receiving Time <SortIcon>{getSortIcon('receivingTime')}</SortIcon></div></Th>
                    <Th>Actions</Th>
                </tr>
                <tr>
                    <Td></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterSelect><option>None L...</option></FilterSelect></Td>
                    <Td><FilterSelect><option>None L...</option></FilterSelect></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterSelect><option>Select...</option></FilterSelect></Td>
                    <Td><FilterSelect><option>None S...</option></FilterSelect></Td>
                    <Td>--</Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterSelect><option>Select...</option></FilterSelect></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterInput type="date" placeholder="From" /></Td>
                    <Td><FilterInput type="date" placeholder="To" /></Td>
                    <Td>
                        <FilterActions>
                            <FilterButton>Search</FilterButton>
                            <FilterButton $reset>Reset</FilterButton>
                        </FilterActions>
                    </Td>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.id}>
                  <Td><input type="checkbox" /></Td>
                  <Td>{item.id}</Td>
                  <Td>{item.prCode}</Td>
                  <Td>{item.tagType}</Td>
                  <Td>{item.gwIp}</Td>
                  <Td>{item.operation}</Td>
                  <Td>{item.status}</Td>
                  <Td>{item.version}</Td>
                  <Td>{item.rssi}</Td>
                  <Td>{item.battery}%</Td>
                  <Td>{item.temperature ? Number(item.temperature).toFixed(1) : '-'}°C</Td>
                  <Td>{new Date(item.transmissionTime).toLocaleString()}</Td>
                  <Td>{new Date(item.receivingTime).toLocaleString()}</Td>
                  <Td></Td>
                </tr>
              ))}
            </tbody>
        </StyledTable>
        {/* 데이터가 없을 경우 메시지 표시 (조건부 렌더링) */}
        {data.length === 0 && (
            <EmptyTableMessage>
                No data available in table
            </EmptyTableMessage>
        )}
    </TableContainer>
  );
}