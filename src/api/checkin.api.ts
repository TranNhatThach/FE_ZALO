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
   * Gửi thông tin chấm công
   * @param formData chứa latitude, longitude, image (từ camera)
   */
  checkIn: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post<ApiResponse<any>>('/v1/checkins', formData),
};
