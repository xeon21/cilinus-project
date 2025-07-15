// frontend/src/app/edge-editor/SceneSidebar.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditorStore } from '@/store/editorStore';

const SidebarWrapper = styled.aside`
  width: 250px;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const SceneList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SceneItem = styled.li<{ $isActive: boolean }>`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  background-color: ${props => props.$isActive ? '#3498db' : '#ecf0f1'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.$isActive ? '#2980b9' : '#bdc3c7'};
  }
`;

const AddSceneWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SceneNameInput = styled.input`
  flex-grow: 1;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const AddSceneButton = styled.button`
  padding: 0.6rem;
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #8e44ad;
  }
`;

export const SceneSidebar = () => {
  const { scenes, activeSceneId, addScene, setActiveSceneId } = useEditorStore();
  const [newSceneName, setNewSceneName] = useState("");

  const handleAddScene = () => {
    if (newSceneName.trim()) {
      addScene(newSceneName.trim());
      setNewSceneName("");
    } else {
      alert("새 씬의 이름을 입력해주세요.");
    }
  };
  
  return (
    <SidebarWrapper>
      <Section>
        <SectionTitle>씬 목록</SectionTitle>
        <SceneList>
          {scenes.map(scene => (
            <SceneItem 
              key={scene.id} 
              $isActive={scene.id === activeSceneId}
              onClick={() => setActiveSceneId(scene.id)}
            >
              {scene.name}
            </SceneItem>
          ))}
        </SceneList>
        <AddSceneWrapper>
          <SceneNameInput 
            type="text" 
            placeholder="새 씬 이름"
            value={newSceneName}
            onChange={(e) => setNewSceneName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddScene()}
          />
          <AddSceneButton onClick={handleAddScene}>추가</AddSceneButton>
        </AddSceneWrapper>
      </Section>
    </SidebarWrapper>
  );
};