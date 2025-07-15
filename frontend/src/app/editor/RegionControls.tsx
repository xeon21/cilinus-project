// frontend/src/app/edge-editor/RegionControls.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Region, Scene } from '@/store/editorStore';
import { v4 as uuidv4 } from 'uuid';

const ControlsWrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

// [추가] Props 타입 정의
interface RegionControlsProps {
    activeScene: Scene;
    setRegions: (regions: Region[]) => void;
}

export const RegionControls = ({ activeScene, setRegions }: RegionControlsProps) => {
  const [regionCount, setRegionCount] = useState(activeScene.regions.length);
  
  // [추가] 활성 씬이 바뀔 때마다 입력 필드의 숫자를 업데이트
  useEffect(() => {
    setRegionCount(activeScene.regions.length);
  }, [activeScene]);

  const handleApply = () => {
    if (regionCount > 0 && regionCount <= 10) {
      const newSize = 100 / regionCount;
      const newRegions: Region[] = Array.from({ length: regionCount }, () => ({
        id: uuidv4(),
        size: newSize,
        content: null,
      }));
      setRegions(newRegions);
    } else {
      alert('영역 개수는 1에서 10 사이로 지정해주세요.');
    }
  };

  return (
    <ControlsWrapper>
      <label htmlFor="region-count">영역 개수:</label>
      <Input
        id="region-count"
        type="number"
        min="1"
        max="10"
        value={regionCount}
        onChange={(e) => setRegionCount(parseInt(e.target.value, 10) || 1)}
      />
      <Button onClick={handleApply}>적용</Button>
    </ControlsWrapper>
  );
};