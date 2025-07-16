// frontend/src/store/dynamicEditorStore.ts
'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import axiosInstance from '@/lib/axios';
import React from 'react';

export interface CanvasResolution {
  id: number;
  name: string;
  width: number;
  height: number;
}

export interface Layer {
  id: string;
  type: 'image' | 'video' | 'webpage' | 'text';
  src?: string;
  text?: string;
  style: React.CSSProperties;
  isBackground: boolean;
}

export interface Region {
  id: string;
  size: number;
  layers: Layer[];
}

export interface Scene {
  id: string;
  name: string;
  regions: Region[];
  transitionTime: number;
  resolutionId: number | null;
}

export interface SavedState {
    scenes: Scene[];
}

interface TextAddingInfo {
    sceneId: string;
    regionId: string;
}

interface EditorState {
  scenes: Scene[];
  activeSceneId: string | null;
  selectedRegionId: { sceneId: string; regionId: string } | null;
  selectedLayerId: string | null;
  textAddingInfo: TextAddingInfo | null;
  canvasResolutions: CanvasResolution[];
  addScene: (name: string) => void;
  setActiveSceneId: (id: string) => void;
  updateRegionSize: (sceneId: string, newSizes: number[]) => void;
  setRegions: (sceneId: string, newRegions: Region[]) => void;
  setSelectedRegionId: (sceneId: string, regionId: string | null) => void;
  reset: () => void;
  resetScene: (sceneId: string) => void;
  updateSceneTransitionTime: (sceneId: string, time: number) => void;
  loadState: (savedState: SavedState) => void;
  moveRegion: (sceneId: string, fromIndex: number, toIndex: number) => void;
  moveScene: (fromIndex: number, toIndex: number) => void;
  fetchCanvasResolutions: () => Promise<void>;
  updateSceneResolution: (sceneId: string, resolutionId: number) => void;
  addLayer: (sceneId: string, regionId: string, layerData: Omit<Layer, 'id'>) => void;
  enterTextAddingMode: (sceneId: string, regionId: string) => void;
  exitTextAddingMode: () => void;
  setSelectedLayerId: (layerId: string | null) => void;
  updateLayerStyle: (layerId: string, newStyle: React.CSSProperties) => void;
  updateLayerText: (layerId: string, newText: string) => void;
  deleteLayer: (layerId: string) => void;
  setBackgroundLayer: (layerId: string) => void;
  unsetBackgroundLayer: (layerId: string) => void;
}

const createNewScene = (name: string, defaultResolutionId: number | null): Scene => ({
  id: uuidv4(),
  name,
  regions: [{ id: uuidv4(), size: 100, layers: [] }],
  transitionTime: 5,
  resolutionId: defaultResolutionId,
});

export const useEditorStore = create<EditorState>((set, get) => ({
  scenes: [],
  activeSceneId: null,
  selectedRegionId: null,
  selectedLayerId: null,
  textAddingInfo: null,
  canvasResolutions: [],

  fetchCanvasResolutions: async () => {
    try {
      const { data } = await axiosInstance.get<CanvasResolution[]>('/canvas-resolutions');
      set({ canvasResolutions: data });
      if (get().scenes.length === 0) {
        const newScene = createNewScene('기본 씬', data[0]?.id || null);
        set({ scenes: [newScene], activeSceneId: newScene.id });
      }
    } catch (error) {
      console.error("캔버스 해상도 목록 로딩 실패:", error);
    }
  },
  addScene: (name) => set((state) => ({ scenes: [...state.scenes, createNewScene(name, get().canvasResolutions[0]?.id || null)] })),
  setActiveSceneId: (id) => set({ activeSceneId: id, selectedRegionId: null }),
  setRegions: (sceneId, newRegions) => set(state => ({ scenes: state.scenes.map(s => s.id === sceneId ? {...s, regions: newRegions} : s) })),
  updateRegionSize: (sceneId, newSizes) => set(state => ({ scenes: state.scenes.map(s => s.id === sceneId ? {...s, regions: s.regions.map((r, i) => ({...r, size: newSizes[i]}))} : s) })),
  setSelectedRegionId: (sceneId, regionId) => set({ selectedRegionId: regionId ? { sceneId, regionId } : null }),
  updateSceneTransitionTime: (sceneId, time) => set(state => ({ scenes: state.scenes.map(s => s.id === sceneId ? {...s, transitionTime: time} : s) })),
  resetScene: (sceneId) => set(state => ({ scenes: state.scenes.map(s => s.id === sceneId ? {...createNewScene(s.name, get().canvasResolutions[0]?.id || null), id: s.id} : s) })),
  loadState: (savedState) => set({ scenes: savedState.scenes, activeSceneId: savedState.scenes[0]?.id || null, selectedRegionId: null }),
  moveRegion: (sceneId, from, to) => set(state => ({ scenes: state.scenes.map(s => s.id === sceneId ? {...s, regions: arrayMove(s.regions, from, to)} : s) })),
  moveScene: (from, to) => set(state => ({ scenes: arrayMove(state.scenes, from, to) })),
  reset: () => {
    const defaultResId = get().canvasResolutions[0]?.id || null;
    const newInitialScene = createNewScene('기본 씬', defaultResId);
    set({
      scenes: [newInitialScene],
      activeSceneId: newInitialScene.id,
      selectedRegionId: null,
      selectedLayerId: null,
      textAddingInfo: null,
    });
  },
  addLayer: (sceneId, regionId, layerData) => set(state => {
    const scenes = state.scenes.map(s => {
      if (s.id === sceneId) {
        return {
          ...s,
          regions: s.regions.map(r => {
            if (r.id === regionId) {
              const isFirstImage = r.layers.length === 0 && layerData.type === 'image';
              const newLayer = {
                id: uuidv4(),
                ...layerData,
                isBackground: isFirstImage,
                style: isFirstImage
                  ? { // 배경 스타일
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      zIndex: 0,
                    } as React.CSSProperties
                  : { // 오버레이 스타일
                      position: 'absolute',
                      top: '10%',
                      left: '10%',
                      width: 'auto',
                      height: 'auto',
                      ...layerData.style,
                      zIndex: (r.layers.reduce((max, l) => Math.max((l.style.zIndex as number) || 0, max), 0) + 1),
                    } as React.CSSProperties
              };
              return { ...r, layers: [...r.layers, newLayer] };
            }
            return r;
          })
        };
      }
      return s;
    });
    return { scenes };
  }),
  enterTextAddingMode: (sceneId, regionId) => set({ textAddingInfo: { sceneId, regionId } }),
  exitTextAddingMode: () => set({ textAddingInfo: null }),
  setSelectedLayerId: (layerId) => set({ selectedLayerId: layerId }),
  updateLayerStyle: (layerId, newStyle) => set(state => ({
    scenes: state.scenes.map(scene => ({
      ...scene,
      regions: scene.regions.map(region => ({
        ...region,
        layers: region.layers.map(layer => 
          layer.id === layerId 
            ? { ...layer, style: { ...layer.style, ...newStyle } } 
            : layer
        )
      }))
    }))
  })),
  updateLayerText: (layerId, newText) => set(state => ({
    scenes: state.scenes.map(scene => ({
      ...scene,
      regions: scene.regions.map(region => ({
        ...region,
        layers: region.layers.map(layer =>
          layer.id === layerId
            ? { ...layer, text: newText }
            : layer
        )
      }))
    }))
  })),
  setBackgroundLayer: (layerId) => set(state => ({
    scenes: state.scenes.map(scene => ({
      ...scene,
      regions: scene.regions.map(region => {
        // Check if the target layer is in this region
        const targetLayer = region.layers.find(l => l.id === layerId);
        if (!targetLayer) return region;

        return {
          ...region,
          layers: region.layers.map(layer => {
            // Set the target layer as background
            if (layer.id === layerId) {
              return {
                ...layer,
                isBackground: true,
                style: {
                  ...layer.style,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  zIndex: 0,
                } as React.CSSProperties
              };
            }
            // If other layers were background, unset them
            if (layer.isBackground) {
              return {
                ...layer,
                isBackground: false,
                style: {
                  ...layer.style,
                  // Reset to default overlay style
                  width: 'auto',
                  height: 'auto',
                  zIndex: 1, // Or some other default zIndex
                }
              };
            }
            return layer;
          })
        };
      })
    }))
  })),
  unsetBackgroundLayer: (layerId) => set(state => ({
    scenes: state.scenes.map(scene => ({
      ...scene,
      regions: scene.regions.map(region => ({
        ...region,
        layers: region.layers.map(layer => {
          if (layer.id === layerId) {
            return {
              ...layer,
              isBackground: false,
              style: {
                ...layer.style,
                width: 'auto',
                height: 'auto',
                zIndex: 1,
              }
            };
          }
          return layer;
        })
      }))
    }))
  })),
  deleteLayer: (layerId) => set(state => ({
    scenes: state.scenes.map(scene => ({
      ...scene,
      regions: scene.regions.map(region => ({
        ...region,
        layers: region.layers.filter(layer => layer.id !== layerId)
      }))
    })),
    selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId
  })),
  updateSceneResolution: (sceneId, resolutionId) =>
    set((state) => ({
        scenes: state.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, resolutionId } : scene
        ),
    })),
}));