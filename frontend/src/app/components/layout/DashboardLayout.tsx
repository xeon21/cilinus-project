'use client';

import React from 'react';
import styled from 'styled-components';

interface DashboardLayoutProps {
  $bgColor?: string;
  $padding?: string;
}

const LayoutContainer = styled.div<DashboardLayoutProps>`
  width: 100%;
  min-height: 100%;
  background-color: ${props => props.$bgColor || '#1c2833'};
  padding: ${props => props.$padding || '2rem'};
  border-radius: 1rem;
`;

interface LayoutProps extends DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children, $bgColor, $padding }: LayoutProps) {
  return (
    <LayoutContainer $bgColor={$bgColor} $padding={$padding}>
      {children}
    </LayoutContainer>
  );
}