import { api } from '../api/fetcher';
import { Branch } from '../types/branch.types';

export const branchService = {
  getAll: () => api.get<Branch[]>('/branches'),
  getById: (id: string) => api.get<Branch>(`/branches/${id}`),
  create: (data: Partial<Branch>) => api.post<Branch>('/branches', data),
  update: (id: string, data: Partial<Branch>) => api.put<Branch>(`/branches/${id}`, data),
  delete: (id: string) => api.del<void>(`/branches/${id}`),
  toggleStatus: (id: string) => api.post<void>(`/branches/${id}/toggle-status`, {}),
};
