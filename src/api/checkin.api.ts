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

  checkOut: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post<ApiResponse<any>>('/v1/attendance/checkout', formData),

  /**
   * Lấy lịch sử chấm công của cá nhân
   */
  getMyHistory: (): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>('/v1/attendance/my-history'),

  /**
   * Lấy lịch sử chấm công cá nhân theo tháng
   */
  getHistoryByMonth: (month: number, year: number): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>(`/v1/attendance/history?month=${month}&year=${year}`),

  /**
   * Lấy lịch sử chấm công công ty theo tháng (Admin)
   */
  getTenantHistoryByMonth: (month: number, year: number): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>(`/v1/attendance/tenant-history?month=${month}&year=${year}`),

  /**
   * Đăng ký khuôn mặt lần đầu (Gửi nhiều ảnh mẫu)
   * @param formData chứa photos[] (danh sách file)
   */
  registerFace: (formData: FormData): Promise<ApiResponse<void>> =>
    api.post<ApiResponse<void>>('/v1/attendance/register-face', formData),
};
