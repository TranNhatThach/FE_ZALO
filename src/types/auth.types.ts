export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  roles: string[];
  name?: string;
  avatar?: string;
  phone?: string;
  zaloId?: string;
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

export interface LoginBasicRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  zaloId?: string;
  fullName: string;
  role: string;
}

export interface ZaloLoginRequest {
  zaloId: string;
  fullName: string;
  avatar: string;
  phone: string;
}
