import { api } from './fetcher';
import { 
  LoginResponse, 
  User, 
  LoginBasicRequest, 
  RegisterRequest, 
  ZaloLoginRequest 
} from '../types/auth.types';

export const authApi = {
  loginBasic: (credentials: LoginBasicRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login/basic', credentials),

  register: (data: RegisterRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/register', data),

  zaloLogin: (data: ZaloLoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login/zalo', data),

  getMe: (): Promise<User> => api.get<User>('/auth/me'),
};
