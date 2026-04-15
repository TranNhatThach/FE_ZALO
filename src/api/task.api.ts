import { api } from './fetcher';
import { Task, UpdateTaskStatusRequest } from '../types/task.types';

export const taskApi = {
  /**
   * GET /v1/tasks/my-tasks
   * Lấy danh sách task được giao cho người dùng hiện tại.
   */
  getMyTasks: (): Promise<Task[]> => api.get<Task[]>('/v1/tasks/my-tasks'),

  /**
   * PATCH /v1/tasks/:taskId/status
   * Cập nhật trạng thái của một task.
   */
  updateStatus: ({ taskId, status }: UpdateTaskStatusRequest): Promise<Task> =>
    api.put<Task>(`/v1/tasks/${taskId}/status`, { status }),

  /**
   * POST /v1/tasks
   * Tạo mới một công việc.
   */
  createTask: (data: any): Promise<Task> => api.post<Task>('/v1/tasks', data),

  /**
   * GET /v1/tasks/tenant/:tenantId
   * Lấy toàn bộ task của doanh nghiệp (Dành cho Admin)
   */
  getTasksByTenant: (tenantId: string | number): Promise<Task[]> => 
    api.get<Task[]>(`/v1/tasks/tenant/${tenantId}`),
};
