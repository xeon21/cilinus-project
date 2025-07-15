// frontend/src/store/menuStore.ts

import { create } from 'zustand';

interface MenuState {
  activeMenu: string | null;
  setActiveMenu: (title: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  activeMenu: null,
  setActiveMenu: (title) => set((state) => ({ 
    activeMenu: state.activeMenu === title ? null : title 
  })),
}));