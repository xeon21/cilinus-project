// 생성: frontend/src/app/tag-status/detail/TagDetailHeader.tsx

'use client';

import React from 'react';
import styled from 'styled-components';
import { Breadcrumb } from './Breadcrumb';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

interface TagDetailHeaderProps {
  storeName: string;
  storeCode: string;
}

export default function TagDetailHeader({ storeName, storeCode }: TagDetailHeaderProps) {
  return (
    <div>
        <Breadcrumb items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Tag Status', href: '/tag-status' },
            { label: 'Tag Detail' },
        ]} />
        <HeaderWrapper>
            <Title>TAG DETAIL OF {storeName} ({storeCode})</Title>
        </HeaderWrapper>
    </div>
  );
}