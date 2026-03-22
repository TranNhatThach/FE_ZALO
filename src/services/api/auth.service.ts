import { axiosInstance } from './axios.instance';
import { LoginResponse, User } from '../../types/auth.types';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/auth/me');
    return data;
  },
};
