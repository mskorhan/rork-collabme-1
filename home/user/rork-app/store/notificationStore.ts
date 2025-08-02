import { create } from 'zustand';
import { mockNotifications } from '@/mocks/notifications';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  loadNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  loadNotifications: () => {
    // In a real app, this would fetch from API
    const notifications = mockNotifications;
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },
  
  markAsRead: (notificationId: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
  
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    set({ notifications: updatedNotifications, unreadCount: 0 });
  },
  
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter(n => !n.read).length;
  },
}));