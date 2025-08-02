import { create } from 'zustand';
import { Notification } from '@/types';
import { mockNotifications } from '@/mocks/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  processingActions: Set<string>;
  loadNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  updateNotificationStatus: (notificationId: string, status: 'accepted' | 'denied') => void;
  setProcessingAction: (notificationId: string, processing: boolean) => void;
  followBackUser: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  processingActions: new Set(),
  
  loadNotifications: () => {
    const notifications = mockNotifications;
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },
  
  markAsRead: (notificationId: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
  
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    set({ notifications: updatedNotifications, unreadCount: 0 });
  },
  
  addNotification: (notification: Notification) => {
    const { notifications } = get();
    const updatedNotifications = [notification, ...notifications];
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
  
  removeNotification: (notificationId: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
  
  updateNotificationStatus: (notificationId: string, status: 'accepted' | 'denied') => {
    const { notifications, processingActions } = get();
    
    // Prevent multiple triggers
    if (processingActions.has(notificationId)) {
      return;
    }
    
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          read: true,
          message: notification.message + ` (${status})`,
        };
      }
      return notification;
    });
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },
  
  setProcessingAction: (notificationId: string, processing: boolean) => {
    const { processingActions } = get();
    const newProcessingActions = new Set(processingActions);
    
    if (processing) {
      newProcessingActions.add(notificationId);
    } else {
      newProcessingActions.delete(notificationId);
    }
    
    set({ processingActions: newProcessingActions });
  },
  
  followBackUser: (notificationId: string) => {
    const { notifications, processingActions } = get();
    
    // Prevent multiple triggers
    if (processingActions.has(notificationId)) {
      return;
    }
    
    // Set processing state
    const newProcessingActions = new Set(processingActions);
    newProcessingActions.add(notificationId);
    
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId && notification.type === 'follow') {
        return {
          ...notification,
          read: true,
          message: notification.message.replace('started following you', 'started following you (Following back)'),
        };
      }
      return notification;
    });
    
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ 
      notifications: updatedNotifications, 
      unreadCount,
      processingActions: newProcessingActions
    });
    
    // Simulate API call delay and then remove processing state
    setTimeout(() => {
      const { processingActions } = get();
      const finalProcessingActions = new Set(processingActions);
      finalProcessingActions.delete(notificationId);
      set({ processingActions: finalProcessingActions });
    }, 1000);
  },
}));