import { fetchData } from '@/api/fetcher';
import { Notification } from '@/stores/notification.store';

export const notificationApi = {
  getNotifications: () => 
    fetchData<Notification[]>('/api/v1/notifications'),

  getUnreadCount: () =>
    fetchData<number>('/api/v1/notifications/unread-count'),

  markAsRead: (id: number) =>
    fetchData<void>(`/api/v1/notifications/${id}/read`, { method: 'PUT' }),

  markAllAsRead: () =>
    fetchData<void>('/api/v1/notifications/mark-all-read', { method: 'PUT' })
};
