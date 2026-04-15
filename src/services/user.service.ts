import { api } from '../api/fetcher';
import { User } from '../types/auth.types';

export const userService = {
  getAll: () => api.get<User[]>('/v1/users'),
  getById: (id: string) => api.get<User>(`/v1/users/${id}`),
  create: (data: Partial<User>) => api.post<User>('/v1/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/v1/users/${id}`, data),
  delete: (id: string) => api.del<void>(`/v1/users/${id}`),
  restore: (id: string) => api.patch<void>(`/v1/users/${id}/restore`, {}),
};
