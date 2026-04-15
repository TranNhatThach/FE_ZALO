import { api } from './fetcher';
import { ApiResponse } from '../types';

export const checkinApi = {
  /**
   * Cập nhật tiến độ / Báo cáo hình ảnh cho Task
   * @param taskId ID của task
   * @param formData chứa file hình ảnh và báo cáo nội dung (nếu có)
   */
  uploadReport: (taskId: string, formData: FormData): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(`/v1/tasks/${taskId}/report`, formData),

  /**
   * Gửi thông tin chấm công (Check-in bằng khuôn mặt)
   * @param formData chứa lat, lon, photo (từ camera)
   */
  checkIn: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post<ApiResponse<any>>('/v1/attendance/check-in', formData),

  /**
   * Lấy lịch sử chấm công của cá nhân
   */
  getMyHistory: (): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>('/v1/attendance/my-history'),
};
