// frontend/src/app/editor/ConfirmOverwriteModal.tsx (새 파일)
'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1050;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background-color: white; padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%; max-width: 400px;
  text-align: center; color: #333;
`;

const Title = styled.h3`
  margin-top: 0; margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ButtonWrapper = styled.div`
  display: flex; justify-content: center;
  gap: 1rem; margin-top: 1.5rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: 1px solid ${props => props.$primary ? '#e74c3c' : '#ccc'};
  border-radius: 4px; cursor: pointer;
  font-weight: 600; font-size: 0.9rem;
  background-color: ${props => props.$primary ? '#e74c3c' : '#f8f9fa'};
  color: ${props => props.$primary ? 'white' : '#333'};
  &:hover { opacity: 0.9; }
`;

interface ConfirmOverwriteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmOverwriteModal = ({ onConfirm, onCancel }: ConfirmOverwriteModalProps) => {
  return (
    <ModalBackdrop onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>이미 콘텐츠가 있습니다.<br/>새 파일로 교체하시겠습니까?</Title>
        <ButtonWrapper>
          <Button onClick={onCancel}>아니오</Button>
          <Button $primary onClick={onConfirm}>예</Button>
        </ButtonWrapper>
      </ModalContent>
    </ModalBackdrop>
  );
};