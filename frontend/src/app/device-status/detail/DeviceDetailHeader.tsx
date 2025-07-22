'use client';

import React from 'react';
import styled from 'styled-components';
import { Breadcrumb } from '../../tag-status/detail/Breadcrumb';

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

interface DeviceDetailHeaderProps {
  deviceName: string;
  deviceId: string;
}

export default function DeviceDetailHeader({ deviceName, deviceId }: DeviceDetailHeaderProps) {
  return (
    <div>
        <Breadcrumb items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Device Status', href: '/device-status' },
            { label: 'Device Detail' },
        ]} />
        <HeaderWrapper>
            <Title>DEVICE DETAIL OF {deviceName} ({deviceId})</Title>
        </HeaderWrapper>
    </div>
  );
}