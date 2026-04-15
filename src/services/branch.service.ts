import { api } from '../api/fetcher';
import { Branch } from '../types/branch.types';

export const branchService = {
  getAll: () => api.get<Branch[]>('/v1/branches'),
  getById: (id: string) => api.get<Branch>(`/v1/branches/${id}`),
  create: (data: Partial<Branch>) => api.post<Branch>('/v1/branches', data),
  update: (id: string, data: Partial<Branch>) => api.put<Branch>(`/v1/branches/${id}`, data),
  delete: (id: string) => api.del<void>(`/v1/branches/${id}`),
  toggleStatus: (id: string) => api.post<void>(`/v1/branches/${id}/toggle-status`, {}),
};
