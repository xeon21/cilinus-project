'use client';

import React from 'react';
import styled from 'styled-components';

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

const PromotionIndicator = styled.span<{ $isPromotion: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
    background-color: ${props => props.$isPromotion ? '#10b981' : '#e5e7eb'};
    color: ${props => props.$isPromotion ? 'white' : '#6b7280'};
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

const CategoryBadge = styled.span<{ $category: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    
    ${props => {
        switch(props.$category) {
            case '특가':
                return `
                    background-color: #ef4444;
                    color: white;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
                `;
            case '프로모션':
                return `
                    background-color: #f59e0b;
                    color: white;
                `;
            case '기본':
                return `
                    background-color: #6b7280;
                    color: white;
                `;
            case '정보':
                return `
                    background-color: #3b82f6;
                    color: white;
                `;
            default:
                return `
                    background-color: #e5e7eb;
                    color: #374151;
                `;
        }
    }}
`;

export interface DeviceDetailData {
    [key: string]: string | number | boolean | null;
    deviceId: string;
    productName: string;
    productDescription: string;
    currentPrice: number;
    originalPrice: number;
    isPromotion: boolean;
    promotionEndDate: string | null;
    tagName: string;
    tagCategory: string;
}


interface DeviceDetailTableProps {
  data: DeviceDetailData[];
  requestSort: (key: keyof DeviceDetailData) => void;
  sortConfig: { key: keyof DeviceDetailData; direction: 'ascending' | 'descending' } | null;
}

export default function DeviceDetailTable({ data, requestSort, sortConfig }: DeviceDetailTableProps) {

  const getSortIcon = (key: keyof DeviceDetailData) => {
    if (!sortConfig || sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };
  
  return (
    <TableContainer>
        <Controls>
            <ControlGroup>
                <span>PRICE TAG LIST</span>
                <button>Save Filter</button>
                <button>DEVICE TYPE</button>
            </ControlGroup>
            <ActionButton>Actions</ActionButton>
        </Controls>
        <StyledTable>
            <thead>
               <tr>
                    <Th><input type="checkbox" /></Th>
                    <Th onClick={() => requestSort('deviceId')}><div className="header-content">Device ID <SortIcon>{getSortIcon('deviceId')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('productName')}><div className="header-content">Product Name <SortIcon>{getSortIcon('productName')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('productDescription')}><div className="header-content">Product Description <SortIcon>{getSortIcon('productDescription')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('currentPrice')}><div className="header-content">Current Price <SortIcon>{getSortIcon('currentPrice')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('originalPrice')}><div className="header-content">Original Price <SortIcon>{getSortIcon('originalPrice')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('isPromotion')}><div className="header-content">Promotion <SortIcon>{getSortIcon('isPromotion')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('promotionEndDate')}><div className="header-content">Promotion End Date <SortIcon>{getSortIcon('promotionEndDate')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('tagName')}><div className="header-content">Tag Name <SortIcon>{getSortIcon('tagName')}</SortIcon></div></Th>
                    <Th onClick={() => requestSort('tagCategory')}><div className="header-content">Tag Category <SortIcon>{getSortIcon('tagCategory')}</SortIcon></div></Th>
                    <Th>Actions</Th>
                </tr>
                <tr>
                    <Td></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterSelect><option>All</option><option>Yes</option><option>No</option></FilterSelect></Td>
                    <Td><FilterInput type="date" /></Td>
                    <Td><FilterInput /></Td>
                    <Td><FilterSelect><option>Select...</option></FilterSelect></Td>
                    <Td>
                        <FilterActions>
                            <FilterButton>Search</FilterButton>
                            <FilterButton $reset>Reset</FilterButton>
                        </FilterActions>
                    </Td>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                <tr key={`${item.deviceId}-${index}`}>
                  <Td><input type="checkbox" /></Td>
                  <Td>{item.deviceId || '-'}</Td>
                  <Td>{item.productName || '-'}</Td>
                  <Td>{item.productDescription || '-'}</Td>
                  <Td>{item.currentPrice ? `${item.currentPrice.toLocaleString()}원` : '-'}</Td>
                  <Td>{item.originalPrice ? `${item.originalPrice.toLocaleString()}원` : '-'}</Td>
                  <Td>
                    <PromotionIndicator $isPromotion={item.isPromotion}>
                      {item.isPromotion ? '✓' : '✗'}
                    </PromotionIndicator>
                  </Td>
                  <Td>{item.promotionEndDate ? new Date(item.promotionEndDate).toLocaleDateString() : '-'}</Td>
                  <Td>{item.tagName || '-'}</Td>
                  <Td>
                    {item.tagCategory ? (
                      <CategoryBadge $category={item.tagCategory}>
                        {item.tagCategory}
                      </CategoryBadge>
                    ) : '-'}
                  </Td>
                  <Td></Td>
                </tr>
              ))}
            </tbody>
        </StyledTable>
        {data.length === 0 && (
            <EmptyTableMessage>
                No data available in table
            </EmptyTableMessage>
        )}
    </TableContainer>
  );
}