// 생성: frontend/src/app/dashboard/resource-status/AlarmHistoryCard.tsx
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

const TableWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding: 2rem 0;
  color: #7f8c8d;
`;

const FilterWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const Select = styled.select`
    background-color: #2c3e50;
    color: white;
    border: 1px solid #4a627a;
    border-radius: 4px;
    padding: 0.4rem;
`;

const Input = styled.input`
    background-color: #2c3e50;
    color: white;
    border: 1px solid #4a627a;
    border-radius: 4px;
    padding: 0.4rem;
    flex-grow: 1;
`;


export default function AlarmHistoryCard() {
    return (
        <Card $padding="1.25rem">
            <Header>
                <Title>ALARM HISTORY</Title>
            </Header>
            <FilterWrapper>
                <Select>
                    <option>Select...</option>
                </Select>
                <Input type="text" placeholder="From"/>
                <Input type="text" placeholder="To"/>
            </FilterWrapper>
            <TableWrapper>
                No records found to show
            </TableWrapper>
        </Card>
    );
}