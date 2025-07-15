// 생성: frontend/src/app/tag-status/detail/Breadcrumb.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const BreadcrumbNav = styled.nav`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Crumb = styled.span`
  &::after {
    content: '/';
    margin: 0 0.5rem;
    color: #9ca3af;
  }
  &:last-child::after {
    content: '';
  }
`;

const CrumbLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <BreadcrumbNav aria-label="breadcrumb">
      {items.map((item, index) => (
        <Crumb key={index}>
          {item.href ? (
            <CrumbLink href={item.href}>{item.label}</CrumbLink>
          ) : (
            <span>{item.label}</span>
          )}
        </Crumb>
      ))}
    </BreadcrumbNav>
  );
};