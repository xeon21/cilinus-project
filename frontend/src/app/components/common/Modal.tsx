// frontend/src/app/components/common/Modal.tsx
'use client';

import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2c3e50;
  padding: 2rem;
  border-radius: 8px;
  color: white;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 600;

  &.primary {
    background-color: #3498db;
    color: white;
    &:hover { background-color: #2980b9; }
  }

  &.secondary {
    background-color: #95a5a6;
    color: white;
    &:hover { background-color: #7f8c8d; }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

export default function Modal({ isOpen, onClose, title, children, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button className="secondary" onClick={onClose}>취소</Button>
          <Button className="primary" onClick={onConfirm}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </ModalBackdrop>
  );
}
