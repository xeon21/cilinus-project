// 생성: frontend/src/hooks/useSort.ts

import { useState, useMemo } from 'react';

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

/**
 * 테이블 데이터 정렬을 위한 커스텀 훅
 * @param data - 정렬할 데이터 배열
 * @returns 정렬된 데이터와 정렬 관련 함수들
 */
export function useSort<T extends Record<string, any>>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  // 정렬된 데이터 계산
  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [data, sortConfig]);

  // 정렬 요청 함수
  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return {
    sortedData,
    requestSort,
    sortConfig
  };
}