import { api } from './fetcher';
import { LoginResponse, User } from '../types/auth.types';

export const authApi = {
  /**
   * POST /auth/login
   * Returns the user object + access/refresh tokens.
   */
  login: (credentials: { email: string; password: string }): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login', credentials),

  /**
   * GET /auth/me
   * Returns the currently authenticated user's profile.
   */
  getMe: (): Promise<User> => api.get<User>('/auth/me'),
};
