import { api } from '../api/fetcher';
import { Attendance } from '../types/attendance.types';

export const attendanceService = {
  /**
   * Đăng ký khuôn mặt người dùng
   */
  registerFace: (blob: Blob) => {
    const formData = new FormData();
    formData.append('photo', blob, 'face_registration.jpg');
    return api.post<string>('/attendance/register-face', formData);
  },

  /**
   * Chấm công bằng khuôn mặt
   */
  checkIn: (blob: Blob, lat?: number, lon?: number) => {
    const formData = new FormData();
    formData.append('photo', blob, 'checkin.jpg');
    if (lat) formData.append('lat', lat.toString());
    if (lon) formData.append('lon', lon.toString());
    return api.post<Attendance>('/attendance/check-in', formData);
  },

  /**
   * Lấy lịch sử chấm công của tôi
   */
  getMyHistory: () => api.get<Attendance[]>('/attendance/my-history'),
};
