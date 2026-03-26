import { api } from '../api/fetcher';
import { User } from '../types/auth.types';

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.del<void>(`/users/${id}`),
  toggleStatus: (id: string) => api.post<void>(`/users/${id}/toggle-status`, {}),
};
