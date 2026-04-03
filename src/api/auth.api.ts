import { api } from './fetcher';
import { LoginResponse, User } from '../types/auth.types';

export const authApi = {
  login: (credentials: { email?: string; phone?: string; password: string }): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login', credentials),

  register: (data: { name: string; email?: string; phone?: string; password: string }): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/register', data),

  zaloLogin: (data: { zaloId: string }): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/zalo-login', data),

  getMe: (): Promise<User> => api.get<User>('/auth/me'),
};
