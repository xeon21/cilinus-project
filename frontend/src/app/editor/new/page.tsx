// frontend/src/app/editor/new/page.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { useEditorStore, Content, SavedState } from '@/store/editorStore';
import { useAuthStore } from '@/store/authStore';
import { ContentTypeModal } from '../ContentTypeModal';
import { ProjectLoadModal } from '../ProjectLoadModal';
import { ConfirmOverwriteModal } from '../ConfirmOverwriteModal';
import { SortableSceneItem } from '../SortableSceneItem';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import DashboardLayout from '../../components/layout/DashboardLayout';

const PageWrapper = styled.div`
  padding: 1.3rem;
  background-color:rgb(220, 225, 233);
  min-height: 100vh;
`;

const Header = styled.header`
  max-width: 1770px;
  margin: 0 auto 2rem auto;
  padding: 1.1rem 1.3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectNameInput = styled.input`
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  &:hover, &:focus {
    border-color: #ccc;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

const ControlButton = styled.button<{ $primary?: boolean; $secondary?: boolean; $danger?: boolean; }>`
  padding: 0.4rem 0.8rem;
  background-color: ${props =>
    props.$primary ? '#e67e22' :
    props.$danger ? '#c0392b' :
    props.$secondary ? '#3498db' :
    '#7f8c8d'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const EditorLayout = styled.div`
  max-width: 1770px;
  margin: 0 auto;
`;

const MainColumn = styled.div`
    flex: 1;
`;

const AddSceneButton = styled.button`
    display: block;
    width: 100%;
    margin-top: 1.3rem;
    padding: 0.8rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: #3498db;
    background-color: #eaf5ff;
    border: 2px dashed #3498db;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #d4e9f9;
        border-color: #2980b9;
    }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default function EdgeEditorPage() {
    const { scenes, addScene, updateRegionContent, reset, loadState, overwriteConfirm, clearOverwriteConfirm, moveScene, fetchCanvasResolutions,canvasResolutions } = useEditorStore();
    const { accessToken } = useAuthStore();

    const searchParams = useSearchParams();
    const router = useRouter();
    const projectIdFromUrl = searchParams.get('id');

    const [projectName, setProjectName] = useState('');
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isContentTypeModalOpen, setIsContentTypeModalOpen] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<{ sceneId: string, regionId: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const projectNameInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleSceneDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = scenes.findIndex((s) => s.id === active.id);
            const newIndex = scenes.findIndex((s) => s.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                moveScene(oldIndex, newIndex);
            }
        }
    }, [scenes, moveScene]);

    useEffect(() => {
        fetchCanvasResolutions();
    }, [fetchCanvasResolutions]);
    
    useEffect(() => {
        const projectId = projectIdFromUrl ? parseInt(projectIdFromUrl, 10) : null;

        const fetchProject = async (id: number) => {
            try {
              const response = await axiosInstance.get(`/projects/${id}`);
              const { name, data } = response.data;
              setProjectName(name);
              loadState(data);
              setCurrentProjectId(id);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status !== 401) {
                    alert("프로젝트를 불러올 수 없습니다.");
                }
                router.push('/editor/new');
            }
        };

        if (projectId && projectId !== currentProjectId) {
          fetchProject(projectId);
        } else if (!projectId) {
            reset();
            setProjectName('');
            setCurrentProjectId(null);
            projectNameInputRef.current?.focus();
        }
    }, [projectIdFromUrl, currentProjectId, loadState, reset, router]);

    const processFile = (file: File, sceneId: string, regionId: string) => {
        const contentType = file.type.startsWith('image') ? 'image' :
                              file.type.startsWith('video') ? 'video' : 'webpage';

        if (contentType === 'webpage' && !/\.(html|htm)$/i.test(file.name)) {
            alert('웹페이지 콘텐츠는 .html 또는 .htm 파일만 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            updateRegionContent(sceneId, regionId, {
                type: contentType,
                src: e.target?.result as string,
            });
        };

        if (contentType === 'webpage') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    };

    const handleZoneClick = (sceneId: string, regionId: string) => {
        setUploadInfo({ sceneId, regionId });
        setIsContentTypeModalOpen(true);
    };

    const handleContentTypeSelect = (contentType: Content['type']) => {
        setIsContentTypeModalOpen(false);
        if (!uploadInfo) return;

        const fileInput = fileInputRef.current;
        if (fileInput) {
            if (contentType === 'image') fileInput.accept = 'image/*';
            else if (contentType === 'video') fileInput.accept = 'video/*';
            else fileInput.accept = '.html,.htm';

            fileInput.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && uploadInfo) {
            const { sceneId, regionId } = uploadInfo;
            processFile(file, sceneId, regionId);
        }
        if (event.target) event.target.value = '';
        setUploadInfo(null);
    };
    
    const handleFileDrop = (sceneId: string, regionId: string, file: File) => {
        processFile(file, sceneId, regionId);
    };

    const handleConfirmOverwrite = () => {
        if (overwriteConfirm) {
            const { sceneId, regionId, file } = overwriteConfirm;
            processFile(file, sceneId, regionId);
            clearOverwriteConfirm();
        }
    };

    const handleAddScene = () => {
        const name = prompt('새 씬의 이름을 입력하세요:', `씬 ${scenes.length + 1}`);
        if (name) {
          addScene(name);
        }
    };

    const handleSave = async () => {
        if (!projectName.trim()) {
            alert('컨텐츠 명을 입력해 주세요.');
            projectNameInputRef.current?.focus();
            return;
        }
        const stateToSave: SavedState = { scenes };

        try {
          if (currentProjectId) {
            await axiosInstance.put(`/projects/${currentProjectId}`, {
              name: projectName, data: stateToSave,
            });
            alert('프로젝트가 성공적으로 업데이트되었습니다.');
          } else {
            const response = await axiosInstance.post('/projects', {
              name: projectName, data: stateToSave,
            });
            alert('새 프로젝트가 저장되었습니다.');
            router.push(`/editor/new?id=${response.data.id}`);
          }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status !== 401) {
                console.error("프로젝트 저장/업데이트 실패:", error);
                alert("프로젝트 저장에 실패했습니다.");
            }
        }
    };

    const handleLoadProject = (projectId: number) => {
        router.push(`/editor/new?id=${projectId}`);
        setIsLoadModalOpen(false);
    };

    // --- [핵심 수정] handleExport 함수 수정 ---
    const handleExport = () => {
        const sceneData = scenes.map(scene => {
            const resolution = canvasResolutions.find(r => r.id === scene.resolutionId);
            const aspectRatio = resolution ? `${resolution.width} / ${resolution.height}` : '1920 / 158';
            
            return {
                id: scene.id,
                html: `
                <div id="scene-${scene.id}" class="scene-container" style="display: none;">
                  ${scene.regions.map(region => {
                    let contentHtml = '';
                    if (region.content) {
                      switch (region.content.type) {
                        case 'image':
                          contentHtml = `<img src="${region.content.src}" alt="">`;
                          break;
                        case 'video':
                          contentHtml = `<video src="${region.content.src}" autoplay muted loop playsinline></video>`;
                          break;
                        case 'webpage':
                          const escapedSrc = region.content.src.replace(/"/g, '&quot;');
                          contentHtml = `<iframe srcdoc="${escapedSrc}"></iframe>`;
                          break;
                      }
                    }
                    return `<div class="region" style="flex-basis: ${region.size}%;">${contentHtml}</div>`;
                  }).join('')}
                </div>
              `,
              transitionTime: scene.transitionTime * 1000,
              aspectRatio: aspectRatio, // sizePreset 대신 aspectRatio 전달
            }
        });

        const escapedSceneData = JSON.stringify(sceneData).replace(/<\/script>/g, '<\\/script>');

        const script = `
          <script>
            const scenes = ${escapedSceneData};
            let currentSceneIndex = 0;
            const displayWrapper = document.querySelector('.display-wrapper');

            function showScene(index) {
              if (!scenes[index]) return;
              
              const currentScene = scenes[index];
              if (displayWrapper) {
                // aspect-ratio를 직접 설정
                displayWrapper.style.aspectRatio = currentScene.aspectRatio;
              }

              scenes.forEach((scene, i) => {
                const el = document.getElementById('scene-' + scene.id);
                if(el) el.style.display = i === index ? 'flex' : 'none';
              });

              if (scenes.length > 1) {
                const nextDelay = currentScene.transitionTime;
                if (nextDelay > 0) {
                    setTimeout(nextScene, nextDelay);
                }
              }
            }

            function nextScene() {
              currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
              showScene(currentSceneIndex);
            }

            if (scenes.length > 0) {
              showScene(0);
            }
          <\/script>
        `;

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${projectName}</title>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #2c3e50; display: flex; justify-content: center; align-items: center;}
        .display-wrapper { 
            width: 98vw;
            max-width: 1600px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .scene-container { display: flex; width: 100%; height: 100%; }
        .region { height: 100%; box-sizing: border-box; overflow: hidden; background-color: #eee; }
        .region img, .region video, .region iframe { 
            width: 100%; height: 100%; object-fit: cover; border: none; display: block; margin: 0px; padding: 0px;
        }
      </style>
    </head>
    <body>
      <div class="display-wrapper">
        ${sceneData.map(s => s.html).join('')}
      </div>
      ${script}
    </body>
    </html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${projectName}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewProject = () => {
        reset();
        setProjectName('');
        setCurrentProjectId(null);
        if (projectIdFromUrl) {
          router.push('/editor/new');
        }
        setTimeout(() => projectNameInputRef.current?.focus(), 0);
    };
  
    return (
        <>
            {isLoadModalOpen && <ProjectLoadModal onClose={() => setIsLoadModalOpen(false)} onLoad={handleLoadProject} />}
            {isContentTypeModalOpen && <ContentTypeModal onClose={() => setIsContentTypeModalOpen(false)} onConfirm={handleContentTypeSelect} />}
            {overwriteConfirm && <ConfirmOverwriteModal onConfirm={handleConfirmOverwrite} onCancel={clearOverwriteConfirm} />}
            
            <PageWrapper>
                <Header>
                    <ProjectNameInput ref={projectNameInputRef} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="컨텐츠 명을 입력해 주세요" />
                    <ControlsWrapper>
                        <ControlButton onClick={handleSave}>{currentProjectId ? '수정하기' : 'DB에 저장'}</ControlButton>
                        <ControlButton $secondary onClick={() => setIsLoadModalOpen(true)}>불러오기</ControlButton>
                        <ControlButton $danger onClick={handleNewProject}>새 프로젝트</ControlButton>
                        <ControlButton $primary onClick={handleExport}>HTML로 내보내기</ControlButton>
                    </ControlsWrapper>
                </Header>
                <EditorLayout>
                    <MainColumn>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleSceneDragEnd}
                        >
                            <SortableContext items={scenes.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                {scenes.map(scene => (
                                    <SortableSceneItem
                                        key={scene.id}
                                        scene={scene}
                                        onZoneClick={handleZoneClick}
                                        onFileDrop={handleFileDrop}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                        <AddSceneButton onClick={handleAddScene}>+ 새 씬 추가</AddSceneButton>
                    </MainColumn>
                </EditorLayout>
            </PageWrapper>
            
            <HiddenFileInput type="file" ref={fileInputRef} onChange={handleFileChange} />
        </>
    );
}