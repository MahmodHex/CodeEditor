import { Colors } from '@/constants/Colors';
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  colors: Colors.dark,
  toggleTheme: () =>
    set((state) => {
      const nextMode = state.mode === 'light' ? 'dark' : 'light';
      return {
        mode: nextMode,
        colors: Colors[nextMode],
      };
    }),
  setTheme: (mode) =>
    set(() => ({
      mode,
      colors: Colors[mode],
    })),
}));

