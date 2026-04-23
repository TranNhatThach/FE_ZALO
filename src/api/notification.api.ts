import { api } from '@/api/fetcher';
import { Notification } from '@/stores/notification.store';

export const notificationApi = {
  getNotifications: () =>
    api.get<Notification[]>('/v1/notifications'),

  getUnreadCount: () =>
    api.get<number>('/v1/notifications/unread-count'),

  markAsRead: (id: number) =>
    api.put<void>(`/v1/notifications/${id}/read`, {}),

  markAllAsRead: () =>
    api.put<void>('/v1/notifications/mark-all-read', {}),

  createAnnouncement: (title: string, message: string, file?: Blob) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    if (file) {
      formData.append('file', file);
    }
    return api.post<void>('/v1/notifications/announcement', formData);
  }
};
