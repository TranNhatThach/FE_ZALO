import { create } from 'zustand';
import { AuthState, User } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';

const ACCESS_TOKEN_KEY = 'zma_access_token';
const REFRESH_TOKEN_KEY = 'zma_refresh_token';
const USER_DATA_KEY = 'zma_user_data';

const getStoredUser = (): User | null => {
  const data = localStorage.getItem(USER_DATA_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),

  login: (userData: User, access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

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
    localStorage.removeItem(USER_DATA_KEY);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  restoreSession: () => {
    const access = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const user = getStoredUser();

    if (access) {
      set({ 
        accessToken: access, 
        refreshToken: refresh || null, 
        isAuthenticated: true,
        user: user
      });
    } else {
      set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null });
    }
  },

  refreshUser: async () => {
    try {
      const userData = await authApi.getMe();
      if (userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        set({ user: userData });
      }
    } catch (e) {
      console.error('Lỗi refresh user:', e);
    }
  },
}));
