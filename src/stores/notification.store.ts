import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  relatedTaskId: number | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (noti: Notification) => void;
  setNotifications: (notis: Notification[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (noti) => set((state) => {
    const updated = [noti, ...state.notifications];
    return {
      notifications: updated,
      unreadCount: state.unreadCount + 1
    };
  }),

  setNotifications: (notis) => set({
    notifications: notis,
    unreadCount: notis.filter(n => !n.isRead).length
  }),

  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    return {
      notifications: updated,
      unreadCount: Math.max(0, updated.filter(n => !n.isRead).length)
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
