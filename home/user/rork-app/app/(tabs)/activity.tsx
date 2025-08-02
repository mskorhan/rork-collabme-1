import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import NotificationItem from '@/components/NotificationItem';
import { mockUsers } from '@/mocks/users';
import { UserProfile, Notification } from '@/types';
import { Heart, MessageCircle, UserPlus, Handshake, Briefcase, Mail, Hash } from 'lucide-react-native';
import { useNotificationStore } from '@/store/notificationStore';
import { useCallback } from 'react';

type NotificationTab = 'all' | 'likes' | 'comments' | 'follows' | 'collabs' | 'jobs' | 'messages';

export default function ActivityScreen() {
  const { notifications, markAsRead, markAllAsRead, loadNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  
  // Mark all notifications as read when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to allow the badge to be visible briefly
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 500);
      
      return () => clearTimeout(timer);
    }, [])
  );
  
  useEffect(() => {
    loadNotifications();
  }, []);

  const handleNotificationAction = (notificationId: string, action: 'accept' | 'deny' | 'follow_back') => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;
    
    // Handle different actions based on notification type and action
    switch (notification.type) {
      case 'collab_request':
        if (action === 'accept') {
          console.log(`Accepted collaboration request from user ${notification.userId}`);
          // TODO: Add user to collaborators, create collaboration
        } else if (action === 'deny') {
          console.log(`Denied collaboration request from user ${notification.userId}`);
          // TODO: Remove collaboration request
        }
        break;
        
      case 'follow':
        if (action === 'follow_back') {
          console.log(`Following back user ${notification.userId}`);
          // TODO: Add user to following list
        }
        break;
        
      case 'job_application':
        if (action === 'accept') {
          console.log(`Accepted job application from user ${notification.userId}`);
          // TODO: Accept job application
        } else if (action === 'deny') {
          console.log(`Denied job application from user ${notification.userId}`);
          // TODO: Reject job application
        }
        break;
    }
    
    // Mark notification as read
    markAsRead(notificationId);
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = (): Notification[] => {
    if (activeTab === 'all') return notifications;
    
    const typeMap: Record<NotificationTab, string[]> = {
      all: [],
      likes: ['like'],
      comments: ['comment'],
      follows: ['follow'],
      collabs: ['collab_request'],
      jobs: ['job_application'],
      messages: ['message'],
    };
    
    return notifications.filter((notification: Notification) => 
      typeMap[activeTab]?.includes(notification.type)
    );
  };

  const filteredNotifications = getFilteredNotifications();

  const tabs = [
    { key: 'all', label: 'All', icon: Hash },
    { key: 'likes', label: 'Likes', icon: Heart },
    { key: 'comments', label: 'Comments', icon: MessageCircle },
    { key: 'follows', label: 'Follows', icon: UserPlus },
    { key: 'collabs', label: 'Collabs', icon: Handshake },
    { key: 'jobs', label: 'Jobs', icon: Briefcase },
    { key: 'messages', label: 'Messages', icon: Mail },
  ] as const;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Hash size={32} color={colors.gray[400]} />
      </View>
      <Text style={styles.emptyTitle}>
        No {activeTab === 'all' ? '' : activeTab} notifications
      </Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up!
      </Text>
    </View>
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      user={mockUsers.find(user => user.id === item.userId) || mockUsers[0]}
      onPress={() => {
        // Navigate to relevant screen based on notification type
        switch (item.type) {
          case 'like':
          case 'comment':
            // TODO: Navigate to post detail
            console.log('Navigate to post:', 'postId' in item ? item.postId : 'unknown');
            break;
          case 'follow':
            // TODO: Navigate to user profile
            console.log('Navigate to user profile:', item.userId);
            break;
          case 'message':
            // TODO: Navigate to conversation
            console.log('Navigate to conversation:', item.userId);
            break;
          case 'collab_request':
          case 'job_application':
            // These are handled by action buttons
            break;
        }
        
        // Mark as read when tapped
        markAsRead(item.id);
      }}
      onAction={handleNotificationAction}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      
      {/* Fixed Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key as NotificationTab)}
                activeOpacity={0.8}
              >
                <IconComponent 
                  size={16} 
                  color={isActive ? colors.primary : colors.gray[500]} 
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    gap: 6,
    minWidth: 70,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
});