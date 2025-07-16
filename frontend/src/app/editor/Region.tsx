// frontend/src/app/editor/Region.tsx
'use client';

import React, { useState, CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { useEditorStore, Region as RegionType } from '@/store/editorStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Zone = styled.div<{
  $isSelected: boolean;
  $isDragOver: boolean;
  $isDragging: boolean;
  $isDropTarget: boolean;
  $isDragOverlay: boolean;
}>`
  position: relative;
  height: 100%;
  width: 100%;
  border-style: ${props => props.$isDropTarget ? 'solid' : 'dashed'};
  border-width: 2px;
  border-color: ${props =>
    props.$isDropTarget ? '#2980b9' : 
    props.$isDragOver ? '#16a085' :
    props.$isSelected ? '#e67e22' :
    '#bdc3c7'};

  padding: 0.6rem;
  box-sizing: border-box;
  background-color: ${props => props.$isDragOver ? '#e8f8f5' : (props.$isDropTarget ? '#eaf5ff' : '#f8f9fa')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s;
  cursor: ${props => props.$isDragOverlay ? 'grabbing' : 'pointer'};
  
  ${props => props.$isDragOverlay && css`
    opacity: 0.95;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  `}

  .drag-handle {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 23px;
    height: 23px;
    background-color: rgba(0,0,0,0.5);
    border-radius: 50%;
    cursor: grab;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover .drag-handle {
    opacity: 1;
  }
  .drag-handle:active {
    cursor: grabbing;
  }
  
  p {
      font-size: 0.85rem;
      color: #555;
      text-align: center;
      pointer-events: none;
  }

  &:hover {
    background-color: #f0f8ff;
  }

  ${props => props.$isDragging && css`
    border-color: #e0e0e0;
    background-color: #f5f5f5;
    & > * {
      visibility: hidden;
    }
  `}
`;

const ContentWrapper = styled.div.attrs({
  className: 'content-wrapper'
})`
  width: 100%;
  height: 100%;
  pointer-events: none;
  img, video, iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }
`;

const SizeDisplay = styled.div.attrs({
  className: 'size-display'
})`
  position: absolute;
  bottom: 5px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  border-radius: 4px;
  pointer-events: none;
`;

const ModifyButton = styled.button.attrs({
    className: 'modify-button'
})`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;

  ${Zone}:hover & {
    opacity: 1;
  }
`;

interface RegionProps {
  sceneId: string;
  region: RegionType;
  canvasHeight: number;
  onZoneClick: () => void;
  onFileDrop: (file: File) => void;
  isDragOverlay?: boolean;
}

const VIRTUAL_CANVAS_WIDTH = 1920;

export const Region = ({ sceneId, region, canvasHeight, onZoneClick, onFileDrop, isDragOverlay = false }: RegionProps) => {
  const { selectedRegionId, setSelectedRegionId, setOverwriteConfirm } = useEditorStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({id: region.id, disabled: isDragOverlay});
  
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: '100%',
    width: '100%',
  };

  const isSelected = selectedRegionId?.sceneId === sceneId && selectedRegionId?.regionId === region.id;
  
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('drag-handle') || (e.target as HTMLElement).tagName === 'BUTTON') {
      e.stopPropagation();
      return;
    }
    
    if (!region.content) {
      onZoneClick();
    } else {
      setSelectedRegionId(sceneId, region.id);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];

    if (file) {
      if (region.content) {
        setOverwriteConfirm({ sceneId, regionId: region.id, file });
      } else {
        onFileDrop(file);
      }
      e.dataTransfer.clearData();
    }
  };

  const renderContent = () => {
    if (!region.content) {
      return <p>클릭하여 콘텐츠를 추가하거나<br/>파일을 끌어다 놓으세요</p>;
    }
    switch (region.content.type) {
      case 'image':
        return <img src={region.content.src} alt="콘텐츠 이미지" />;
      case 'video':
        return <video src={region.content.src} autoPlay muted loop playsInline />;
      case 'webpage':
        return <iframe srcDoc={region.content.src} title="웹페이지 콘텐츠" />;
      default:
        return null;
    }
  };

  const virtualWidth = Math.round(VIRTUAL_CANVAS_WIDTH * (region.size / 100));
  const sizeText = `${virtualWidth} x ${canvasHeight}`;

  return (
    <div
        ref={setNodeRef}
        style={style}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <Zone
            $isSelected={isSelected}
            $isDragOver={isDragOver}
            $isDragging={isDragging}
            $isDropTarget={isOver && !isDragging}
            $isDragOverlay={isDragOverlay}
            {...attributes}
        >
            {!isDragOverlay && <div className="drag-handle" {...listeners}>⠿</div>}
            
            {region.content && !isDragOverlay && (
                <ModifyButton onClick={onZoneClick}>수정</ModifyButton>
            )}
            <ContentWrapper>{renderContent()}</ContentWrapper>
            <SizeDisplay>{sizeText}</SizeDisplay>
        </Zone>
    </div>
  );
};