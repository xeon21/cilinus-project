// frontend/src/app/editor/SortableSceneItem.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SceneEditor } from './SceneEditor';
import { Scene } from '@/store/editorStore';

const Wrapper = styled.div`
  position: relative;
  touch-action: none;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 1.5rem;
  left: -2.5rem;
  width: 2rem;
  height: 2rem;
  background-color: #bdc3c7;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);

  &:active {
    cursor: grabbing;
  }
`;

interface SortableSceneItemProps {
  scene: Scene;
  onZoneClick: (sceneId: string, regionId: string) => void;
  onFileDrop: (sceneId: string, regionId: string, file: File) => void;
}

export const SortableSceneItem = (props: SortableSceneItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Wrapper ref={setNodeRef} style={style}>
      <DragHandle {...listeners} {...attributes}>
        ⠿
      </DragHandle>
      <SceneEditor {...props} />
    </Wrapper>
  );
};