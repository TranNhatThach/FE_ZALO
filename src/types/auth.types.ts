export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  roleName?: string; // Tên role từ Backend (ví dụ: EMPLOYEE, TENANT_ADMIN)
  roles?: string[];  // Danh sách role (nếu có)
  name?: string;
  avatar?: string;
  phone?: string;
  zaloId?: string;
  status?: string;
  tenantId?: string | number;
  tenantCode?: string;
  isFaceRegistered?: boolean;
  birthday?: string;
  gender?: string;
  address?: string;
  identityCard?: string;
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
  refreshUser: () => Promise<void>;
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
