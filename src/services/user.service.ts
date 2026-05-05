import { api } from '../api/fetcher';
import { User } from '../types/auth.types';

export const userService = {
  getAll: () => api.get<User[]>('/v1/users'),
  getById: (id: string) => api.get<User>(`/v1/users/${id}`),
  create: (data: Partial<User>) => api.post<User>('/v1/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/v1/users/${id}`, data),
  delete: (id: string) => api.del<void>(`/v1/users/${id}`),
  restore: (id: string) => api.patch<void>(`/v1/users/${id}/restore`, {}),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.patch<User>('/v1/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  changePassword: (data: any) => api.post<void>('/v1/users/profile/change-password', data),
  requestChangePasswordOTP: () => api.post<void>('/v1/users/profile/change-password/otp', {})
};
