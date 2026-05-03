import { api } from '../api/fetcher';
import { Notification } from '@/stores/notification.store';

export const notificationService = {
  getAll: async () => {
    return await api.get<Notification[]>('/v1/notifications');
  },

  getUnreadCount: async () => {
    return await api.get<number>('/v1/notifications/unread-count');
  },

  markAsRead: async (id: number) => {
    return await api.put<void>(`/v1/notifications/${id}/read`, {});
  },

  markAllAsRead: async () => {
    return await api.put<void>('/v1/notifications/mark-all-read', {});
  }
};
