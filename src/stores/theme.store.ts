import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  primaryColor: string;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  setPrimaryColor: (color: string) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: '#1890ff', // Default primary color
      isDarkMode: false,
      isSidebarCollapsed: false,
      setPrimaryColor: (color) => set({ primaryColor: color }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
