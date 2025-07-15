// frontend/src/app/edge-editor/ContentTypeModal.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Content } from '@/store/editorStore';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.2rem; /* 1.5rem -> 1.2rem */
  border-radius: 6px; /* 8px -> 6px */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 280px; /* 320px -> 280px */
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 0.8rem; /* 1rem -> 0.8rem */
  font-size: 1rem; /* 1.1rem -> 1rem */
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem; /* 0.6rem -> 0.5rem */
  margin-bottom: 0.8rem; /* 1rem -> 0.8rem */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.85rem; /* 0.9rem -> 0.85rem */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.4rem 0.8rem; /* 0.5rem 1rem -> 0.4rem 0.8rem */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500; /* 600 -> 500 */
  font-size: 0.85rem; /* 0.9rem -> 0.85rem */
  background-color: ${props => props.$primary ? '#3498db' : '#ecf0f1'};
  color: ${props => props.$primary ? 'white' : '#333'};

  &:hover {
    opacity: 0.9;
  }
`;


interface ContentTypeModalProps {
  onClose: () => void;
  onConfirm: (contentType: Content['type']) => void;
}

export const ContentTypeModal = ({ onClose, onConfirm }: ContentTypeModalProps) => {
  const [selectedType, setSelectedType] = useState<Content['type']>('image');

  const handleConfirm = () => {
    onConfirm(selectedType);
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>콘텐츠 타입 선택</Title>
        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value as Content['type'])}>
          <option value="image">이미지</option>
          <option value="video">동영상</option>
          <option value="webpage">웹페이지</option>
        </Select>
        <ButtonWrapper>
          <Button onClick={onClose}>취소</Button>
          <Button $primary onClick={handleConfirm}>확인</Button>
        </ButtonWrapper>
      </ModalContent>
    </ModalBackdrop>
  );
};