// 생성: frontend/src/app/dashboard/resource-status/InformationCard.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../../components/layout/Card';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #34495e;
`;

const Title = styled.h4`
  color: #ecf0f1;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.25rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #34495e;

  &:last-child {
    border-bottom: none;
  }

  .key {
    color: #95a5a6;
    font-weight: 500;
  }

  .value {
    color: #ecf0f1;
    font-weight: 600;
  }

  .link {
    color: #3498db;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .status-normal {
    color: #2ecc71;
  }
`;

// --- [추가] 서비스 목록을 위한 스타일 ---
const ServiceListWrapper = styled.div`
    width: 100%;
`;

const ServiceList = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 0.5rem;
    width: 100%;
`;

const ServiceListItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 0.85rem;
`;
// ---

export default function InformationCard() {
    const serverInfo = {
        name: 'ESI_SERVER',
        type: 'ESL (LEADER)',
        ip: '10.0.0.8 / 02:BB:A9:AC:37:PC',
        status: 'NORMAL',
        services: [
            { name: 'WEB SERVER', status: 'OK' },
            { name: 'WAS', status: 'OK' },
            { name: 'LAYOUT DESIGNER', status: 'OK' },
            { name: 'EVENT MANAGER', status: 'OK' },
            { name: 'SCHEDULE MANAGER', status: 'OK' },
            { name: 'WEBSOCKET MANAGER', status: 'OK' },
            { name: 'SMTP MANAGER', status: 'OK' },
            { name: 'FILE DOWNLOAD MANAGER', status: 'OK' },
            { name: 'STATS MANAGER', status: 'OK' },
            { name: 'NETWORK TIME SERVER', status: 'OK' },
            { name: 'INFORTAB PLUS MANAGER', status: 'OK' },
        ]
    };

    return (
        <Card $padding="1.25rem">
            <Header>
                <Title>INFORMATION</Title>
            </Header>
            <InfoList>
                <InfoItem><span className="key">NAME</span> <span className="value">{serverInfo.name}</span></InfoItem>
                <InfoItem><span className="key">TYPE</span> <a href="#" className="value link">{serverInfo.type}</a></InfoItem>
                <InfoItem><span className="key">IP / MAC</span> <span className="value">{serverInfo.ip}</span></InfoItem>
                <InfoItem><span className="key">STATUS</span> <span className="value status-normal">{serverInfo.status}</span></InfoItem>
                 {/* --- [수정] 서비스 목록 렌더링 구조 변경 --- */}
                <InfoItem>
                    <ServiceListWrapper>
                        <div className="key">SERVICE</div>
                        <ServiceList>
                            {serverInfo.services.map(service => (
                                <ServiceListItem key={service.name}>
                                    <span className="key">{service.name}</span>
                                    <span className="value status-normal">{service.status}</span>
                                </ServiceListItem>
                            ))}
                        </ServiceList>
                    </ServiceListWrapper>
                </InfoItem>
                {/* --- */}
            </InfoList>
        </Card>
    );
}