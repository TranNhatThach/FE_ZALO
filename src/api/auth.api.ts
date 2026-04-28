import { api } from './fetcher';
import { 
  LoginResponse, 
  User, 
  LoginBasicRequest, 
  RegisterRequest, 
  ZaloLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/auth.types';

export const authApi = {
  loginBasic: (credentials: LoginBasicRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login/basic', credentials),

  /** POST /auth/register — Đăng ký tài khoản mới */
  register: (data: RegisterRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/register', data),

  zaloLogin: (data: ZaloLoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login/zalo', data),

  getMe: (): Promise<User> => api.get<User>('/v1/users/profile'),
  updateProfile: (data: Partial<User>): Promise<User> => api.put<User>('/v1/users/profile', data),

  logout: (): Promise<void> => api.post<void>('/auth/logout', {}),

  forgotPassword: (data: ForgotPasswordRequest): Promise<void> =>
    api.post<void>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest): Promise<void> =>
    api.post<void>('/auth/reset-password', data),
};
