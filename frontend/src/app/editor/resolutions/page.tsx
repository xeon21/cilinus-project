// frontend/src/app/admin/resolutions/page.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ResolutionManager } from './ResolutionManager';

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ecf0f1;
  margin-bottom: 1.5rem;
`;

export default function ResolutionsPage() {
  return (
    // --- [수정] DashboardLayout에서 padding prop을 제거합니다. ---
    <DashboardLayout>
      <PageTitle>캔버스 해상도 관리</PageTitle>
      <ResolutionManager />
    </DashboardLayout>
  );
}