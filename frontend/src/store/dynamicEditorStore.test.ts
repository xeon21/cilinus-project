// frontend/src/store/dynamicEditorStore.test.ts
import { useEditorStore, Layer } from './dynamicEditorStore';
import { act } from '@testing-library/react';

describe('dynamicEditorStore', () => {
  beforeEach(() => {
    act(() => {
      useEditorStore.getState().reset();
    });
  });

  // ... (기존 테스트 케이스 생략) ...

  it('updateSceneResolution은 특정 씬의 resolutionId를 변경해야 한다', () => {
    const sceneId = useEditorStore.getState().scenes[0].id;
    const newResolutionId = 99;

    act(() => {
      useEditorStore.getState().updateSceneResolution(sceneId, newResolutionId);
    });

    const updatedScene = useEditorStore.getState().scenes[0];
    expect(updatedScene.resolutionId).toBe(newResolutionId);
  });
});
