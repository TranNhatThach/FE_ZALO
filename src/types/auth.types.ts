export interface User {
  id: string;
  email: string;
  roles: string[];
  name?: string;
  avatar?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (userData: User, access: string, refresh: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  restoreSession: () => void;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
