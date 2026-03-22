import { create } from 'zustand';
import Cookies from 'js-cookie';
import { AuthState, User } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'zma_access_token';
const REFRESH_TOKEN_KEY = 'zma_refresh_token';

const cookieOptions: Cookies.CookieAttributes = {
  // Use secure cookies in production, and standard strict SameSite
  secure: import.meta.env.MODE === 'production',
  sameSite: 'strict',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: Cookies.get(ACCESS_TOKEN_KEY) || null,
  refreshToken: Cookies.get(REFRESH_TOKEN_KEY) || null,
  isAuthenticated: !!Cookies.get(ACCESS_TOKEN_KEY),

  login: (userData: User, access: string, refresh: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, access, cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, refresh, cookieOptions);

    set({
      user: userData,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  logout: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, cookieOptions);
    Cookies.remove(REFRESH_TOKEN_KEY, cookieOptions);

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
    const access = Cookies.get(ACCESS_TOKEN_KEY);
    const refresh = Cookies.get(REFRESH_TOKEN_KEY);

    if (access) {
      set({ accessToken: access, refreshToken: refresh || null, isAuthenticated: true });
    } else {
      set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null });
    }
  },
}));
