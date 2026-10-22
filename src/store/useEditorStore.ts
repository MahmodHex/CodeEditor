import { ActiveTab, DeviceMode } from '@/types/editor';
import { create } from 'zustand';

interface EditorState {
  activeTab: ActiveTab;
  deviceMode: DeviceMode;
  splitRatio: number; // 0.1 to 0.9 (code vs preview distribution)
  zoomLevel: number;  // 50, 75, 100, 125, 150 (%)
  isLiveRunning: boolean;

  setActiveTab: (tab: ActiveTab) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setSplitRatio: (ratio: number) => void;
  setZoomLevel: (zoom: number) => void;
  toggleLiveRunning: () => void;
  resetEditorWorkspace: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: 'html',
  deviceMode: 'desktop',
  splitRatio: 0.5, // 50% code, 50% preview by default
  zoomLevel: 100,
  isLiveRunning: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setSplitRatio: (ratio) => set({ splitRatio: Math.min(Math.max(ratio, 0.15), 0.85) }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  toggleLiveRunning: () => set((state) => ({ isLiveRunning: !state.isLiveRunning })),
  resetEditorWorkspace: () =>
    set({
      activeTab: 'html',
      deviceMode: 'desktop',
      splitRatio: 0.5,
      zoomLevel: 100,
      isLiveRunning: true,
    }),
}));

