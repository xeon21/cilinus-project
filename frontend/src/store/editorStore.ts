// frontend/src/store/editorStore.ts
'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import axiosInstance from '@/lib/axios';

// DB에서 가져올 캔버스 해상도 정보 타입
export interface CanvasResolution {
  id: number;
  name: string;
  width: number;
  height: number;
}

export interface Content {
  type: 'image' | 'video' | 'webpage';
  src: string;
}

export interface Region {
  id: string;
  size: number;
  content: Content | null;
}

// Scene 인터페이스에서 sizePreset을 resolutionId로 대체
export interface Scene {
  id: string;
  name: string;
  regions: Region[];
  transitionTime: number;
  resolutionId: number | null; // 예: 1, 2 등 DB의 id 값
}

export interface OverwriteConfirmState {
  sceneId: string;
  regionId: string;
  file: File;
}

export interface SavedState {
    scenes: Scene[];
}

// EditorState 인터페이스 업데이트
interface EditorState {
  scenes: Scene[];
  activeSceneId: string | null;
  selectedRegionId: { sceneId: string; regionId: string } | null;
  overwriteConfirm: OverwriteConfirmState | null;
  canvasResolutions: CanvasResolution[]; // 해상도 목록 상태

  addScene: (name: string) => void;
  setActiveSceneId: (id: string) => void;
  updateRegionSize: (sceneId: string, newSizes: number[]) => void;
  updateRegionContent: (sceneId: string, regionId: string, content: Content | null) => void;
  setRegions: (sceneId: string, newRegions: Region[]) => void;
  setSelectedRegionId: (sceneId: string, regionId: string | null) => void;
  reset: () => void;
  resetScene: (sceneId: string) => void;
  updateSceneTransitionTime: (sceneId: string, time: number) => void;
  loadState: (savedState: SavedState) => void;
  setOverwriteConfirm: (data: OverwriteConfirmState) => void;
  clearOverwriteConfirm: () => void;
  moveRegion: (sceneId: string, fromIndex: number, toIndex: number) => void;
  moveScene: (fromIndex: number, toIndex: number) => void;
  
  // 새로 추가된 액션들
  fetchCanvasResolutions: () => Promise<void>;
  updateSceneResolution: (sceneId: string, resolutionId: number) => void;
}

const createNewScene = (name: string, defaultResolutionId: number | null): Scene => ({
  id: uuidv4(),
  name,
  regions: [{ id: uuidv4(), size: 100, content: null }],
  transitionTime: 5,
  resolutionId: defaultResolutionId,
});

const createNewRegion = (): Region => ({
    id: uuidv4(),
    size: 100,
    content: null,
});

export const useEditorStore = create<EditorState>((set, get) => ({
  scenes: [],
  activeSceneId: null,
  selectedRegionId: null,
  overwriteConfirm: null,
  canvasResolutions: [],

  fetchCanvasResolutions: async () => {
    try {
      const { data } = await axiosInstance.get<CanvasResolution[]>('/canvas-resolutions');
      set({ canvasResolutions: data });
      
      const currentScenes = get().scenes;
      if (currentScenes.length === 0) {
        const defaultResId = data[0]?.id || null;
        const newScene = createNewScene('기본 씬', defaultResId);
        set({ scenes: [newScene], activeSceneId: newScene.id });
      } else {
        const updatedScenes = currentScenes.map(scene => ({
          ...scene,
          resolutionId: scene.resolutionId ?? (data[0]?.id || null)
        }));
        set({ scenes: updatedScenes });
      }
    } catch (error) {
      console.error("캔버스 해상도 목록 로딩 실패:", error);
      const fallbackResolutions = [
        { id: 1, name: '1920x158', width: 1920, height: 158 },
        { id: 2, name: '1920x540', width: 1920, height: 540 },
      ];
      set({ canvasResolutions: fallbackResolutions });
      if (get().scenes.length === 0) {
        const newScene = createNewScene('기본 씬', fallbackResolutions[0].id);
        set({ scenes: [newScene], activeSceneId: newScene.id });
      }
    }
  },

  addScene: (name: string) => {
    const defaultResId = get().canvasResolutions[0]?.id || null;
    const newScene = createNewScene(name, defaultResId);
    set((state) => ({
      scenes: [...state.scenes, newScene],
      activeSceneId: newScene.id,
    }));
  },

  updateSceneResolution: (sceneId, resolutionId) =>
    set((state) => ({
        scenes: state.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, resolutionId } : scene
        ),
    })),
    
  setActiveSceneId: (id) => set({ activeSceneId: id, selectedRegionId: null }),
  setRegions: (sceneId, newRegions) => set((state) => ({ scenes: state.scenes.map((scene) => scene.id === sceneId ? { ...scene, regions: newRegions } : scene), selectedRegionId: null })),
  updateRegionSize: (sceneId, newSizes) => set((state) => ({ scenes: state.scenes.map((scene) => scene.id === sceneId ? { ...scene, regions: scene.regions.map((region, index) => ({...region, size: newSizes[index]})) } : scene) })),
  updateRegionContent: (sceneId, regionId, content) => set((state) => ({ scenes: state.scenes.map((scene) => scene.id === sceneId ? { ...scene, regions: scene.regions.map((region) => region.id === regionId ? { ...region, content } : region) } : scene) })),
  setSelectedRegionId: (sceneId, regionId) => set({ selectedRegionId: regionId ? { sceneId, regionId } : null }),
  updateSceneTransitionTime: (sceneId, time) => set((state) => ({ scenes: state.scenes.map((scene) => scene.id === sceneId ? { ...scene, transitionTime: time } : scene) })),
  resetScene: (sceneId) => set((state) => {
    const defaultResId = get().canvasResolutions[0]?.id || null;
    return { scenes: state.scenes.map((scene) => scene.id === sceneId ? { ...createNewScene(scene.name, defaultResId), id: scene.id } : scene), selectedRegionId: null }
  }),
  loadState: (savedState) => {
    set({
      scenes: savedState.scenes,
      activeSceneId: savedState.scenes[0]?.id || null,
      selectedRegionId: null,
    });
    get().fetchCanvasResolutions();
  },
  setOverwriteConfirm: (data) => set({ overwriteConfirm: data }),
  clearOverwriteConfirm: () => set({ overwriteConfirm: null }),
  moveRegion: (sceneId, fromIndex, toIndex) => set((state) => {
      const sceneToUpdate = state.scenes.find(s => s.id === sceneId);
      if (!sceneToUpdate) return state;
      const newRegions = arrayMove(sceneToUpdate.regions, fromIndex, toIndex);
      return { scenes: state.scenes.map(s => s.id === sceneId ? { ...s, regions: newRegions } : s) };
  }),
  moveScene: (fromIndex, toIndex) => set((state) => ({ scenes: arrayMove(state.scenes, fromIndex, toIndex) })),
  reset: () => {
    const defaultResId = get().canvasResolutions[0]?.id || null;
    const newInitialScene = createNewScene('기본 씬', defaultResId);
    set({
      scenes: [newInitialScene],
      activeSceneId: newInitialScene.id,
      selectedRegionId: null,
      overwriteConfirm: null,
    });
  },
}));