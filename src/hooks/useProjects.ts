import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/fetcher';
import { Project } from '@/types/project.types';

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/v1/projects');
      return response;
    },
  });
};

export const useGetMyManagedProjects = () => {
  return useQuery({
    queryKey: ['my-managed-projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/v1/projects/my-managed');
      return response;
    },
  });
};

export const useGetProjectDetail = (id?: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<Project>(`/v1/projects/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<Project>('/v1/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put<Project>(`/v1/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/v1/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
