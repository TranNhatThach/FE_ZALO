import { api } from './fetcher';
import { Task, UpdateTaskStatusRequest, TaskCheckInRequest, TaskCompleteRequest } from '../types/task.types';
import { PageResponse } from './customer.api';

export const taskApi = {
  /**
   * GET /v1/tasks/my-tasks
   * Lấy danh sách task được giao cho người dùng hiện tại.
   */
  getMyTasks: (): Promise<Task[]> => api.get<Task[]>('/v1/tasks/my-tasks'),

  /**
   * PUT /v1/tasks/:taskId/status
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
  getTasksByTenant: (tenantId: string | number, page = 0, size = 10): Promise<PageResponse<Task>> => 
    api.get<PageResponse<Task>>(`/v1/tasks/tenant/${tenantId}?page=${page}&size=${size}`),

  /**
   * POST /v1/tasks/:taskId/check-in
   * Check-in tại hiện trường (GPS + ảnh + ghi chú)
   */
  checkIn: ({ taskId, photo, lat, lon, note }: TaskCheckInRequest): Promise<Task> => {
    const formData = new FormData();
    if (photo) formData.append('photo', photo);
    formData.append('lat', lat.toString());
    formData.append('lon', lon.toString());
    if (note) formData.append('note', note);
    return api.post<Task>(`/v1/tasks/${taskId}/check-in`, formData);
  },

  /**
   * POST /v1/tasks/:taskId/complete
   * Hoàn thành task (ảnh hoàn thành + kết quả + xác nhận khách)
   */
  complete: ({ taskId, photo, resultNote, customerConfirmed }: TaskCompleteRequest): Promise<Task> => {
    const formData = new FormData();
    if (photo) formData.append('photo', photo);
    if (resultNote) formData.append('resultNote', resultNote);
    if (customerConfirmed !== undefined) formData.append('customerConfirmed', customerConfirmed.toString());
    return api.post<Task>(`/v1/tasks/${taskId}/complete`, formData);
  },

  /**
   * GET /v1/tasks/unassigned
   * Lấy task chưa giao cho ai (Nhân viên tự nhận)
   */
  getUnassignedTasks: (): Promise<Task[]> => api.get<Task[]>('/v1/tasks/unassigned'),

  /**
   * POST /v1/tasks/:taskId/claim
   * Nhận task (Nhân viên tự nhận task chưa giao)
   */
  claimTask: (taskId: string): Promise<Task> => api.post<Task>(`/v1/tasks/${taskId}/claim`, {}),

  /**
   * DELETE /v1/tasks/:taskId
   * Xóa một task.
   */
  deleteTask: (taskId: string | number): Promise<void> => api.del(`/v1/tasks/${taskId}`),

  /**
   * POST /v1/tasks/:taskId/approve
   * Admin phê duyệt task.
   */
  approve: (taskId: string | number, note?: string): Promise<Task> =>
    api.post<Task>(`/v1/tasks/${taskId}/approve`, { note }),

  /**
   * POST /v1/tasks/:taskId/reject
   * Admin từ chối task.
   */
  reject: (taskId: string | number, reason: string): Promise<Task> =>
    api.post<Task>(`/v1/tasks/${taskId}/reject`, { reason }),
};
