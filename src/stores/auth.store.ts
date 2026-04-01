import { create } from 'zustand';
import { AuthState, User } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'zma_access_token';
const REFRESH_TOKEN_KEY = 'zma_refresh_token';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),

  login: (userData: User, access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

    set({
      user: userData,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  restoreSession: () => {
    const access = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (access) {
      set({ accessToken: access, refreshToken: refresh || null, isAuthenticated: true });
    } else {
      set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null });
    }
  },
}));

