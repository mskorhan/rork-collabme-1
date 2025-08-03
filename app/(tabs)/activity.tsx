import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useFocusEffect, router } from 'expo-router';
import { colors } from '@/constants/colors';
import NotificationItem from '@/components/NotificationItem';
import { mockUsers } from '@/mocks/users';
import { UserProfile, Notification } from '@/types';
import { ThumbsUp, MessageCircle, UserPlus, Handshake, Briefcase, Mail, Hash } from 'lucide-react-native';
import { useNotificationStore } from '@/store/notificationStore';
import { useCallback } from 'react';

type NotificationTab = 'all' | 'likes' | 'comments' | 'follows' | 'collabs' | 'jobs' | 'messages';

export default function ActivityScreen() {
  const { notifications, markAsRead, markAllAsRead, loadNotifications, updateNotificationStatus, setProcessingAction, followBackUser, processingActions } = useNotificationStore();
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
        // Prevent multiple triggers
        if (processingActions.has(notificationId)) {
          return;
        }
        
        setProcessingAction(notificationId, true);
        
        if (action === 'accept') {
          console.log(`Accepted collaboration request from user ${notification.userId}`);
          // TODO: Implement API call to accept collaboration
          // Example: await acceptCollabRequest(notification.relatedCollabId);
          
          // Update notification status
          updateNotificationStatus(notificationId, 'accepted');
          
          // Show success feedback
          console.log('Collaboration request accepted!');
        } else if (action === 'deny') {
          console.log(`Denied collaboration request from user ${notification.userId}`);
          // TODO: Implement API call to deny collaboration
          // Example: await denyCollabRequest(notification.relatedCollabId);
          
          // Update notification status - move to denied tab instead of removing
          updateNotificationStatus(notificationId, 'denied');
          
          // Show feedback
          console.log('Collaboration request denied.');
        }
        
        // Remove processing state after a delay
        setTimeout(() => {
          setProcessingAction(notificationId, false);
        }, 1000);
        break;
        
      case 'follow':
        if (action === 'follow_back') {
          // Prevent multiple triggers
          if (processingActions.has(notificationId)) {
            return;
          }
          
          console.log(`Following back user ${notification.userId}`);
          // Use the store's follow back functionality
          followBackUser(notificationId);
          
          // Show success feedback
          console.log('Now following user!');
          
          // DO NOT navigate to profile - button should only follow back
        }
        break;
        
      case 'job_application':
        // Prevent multiple triggers
        if (processingActions.has(notificationId)) {
          return;
        }
        
        setProcessingAction(notificationId, true);
        
        if (action === 'accept') {
          console.log(`Accepted job application from user ${notification.userId}`);
          // TODO: Implement API call to accept job application
          // Example: await acceptJobApplication(notification.relatedJobId, notification.userId);
          
          // Update notification status
          updateNotificationStatus(notificationId, 'accepted');
          
          // Show success feedback
          console.log('Job application accepted!');
        } else if (action === 'deny') {
          console.log(`Denied job application from user ${notification.userId}`);
          // TODO: Implement API call to deny job application
          // Example: await denyJobApplication(notification.relatedJobId, notification.userId);
          
          // Update notification status - move to denied tab instead of removing
          updateNotificationStatus(notificationId, 'denied');
          
          // Show feedback
          console.log('Job application denied.');
        }
        
        // Remove processing state after a delay
        setTimeout(() => {
          setProcessingAction(notificationId, false);
        }, 1000);
        break;
    }
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
    { key: 'likes', label: 'Likes', icon: ThumbsUp },
    { key: 'comments', label: 'Comments', icon: MessageCircle },
    { key: 'follows', label: 'Follows', icon: UserPlus },
    { key: 'collabs', label: 'Collabs', icon: Handshake },
    { key: 'jobs', label: 'Jobs', icon: Briefcase },
    { key: 'messages', label: 'Messages', icon: Mail },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
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
                  size={14} 
                  color={isActive ? colors.primary : colors.gray[600]} 
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {/* Notifications List */}
      <View style={styles.notificationsContainer}>
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              user={mockUsers.find(user => user.id === item.userId) || mockUsers[0]}
              isProcessing={processingActions.has(item.id)}
              onPress={() => {
                // Navigate to relevant screen based on notification type
                switch (item.type) {
                  case 'like':
                  case 'comment':
                    // Navigate to post detail - use relatedPostId if available
                    if (item.relatedPostId) {
                      // For now, navigate to home tab since we don't have post detail screen
                      router.push('/(tabs)/');
                    } else if (item.relatedId) {
                      router.push('/(tabs)/');
                    }
                    break;
                  case 'follow':
                    // Navigate to user profile
                    if (item.userId) {
                      router.push(`/profile/${item.userId}`);
                    }
                    break;
                  case 'message':
                    // Navigate to messages inbox
                    router.push('/messages/index');
                    break;
                  case 'collab_request':
                    // Navigate to collab requests page (inbox)
                    router.push('/messages/index?tab=collab');
                    break;
                  case 'job_application':
                    // Navigate to job details page, not user profile
                    if (item.relatedJobId) {
                      router.push(`/job/${item.relatedJobId}`);
                    } else if (item.userId) {
                      router.push(`/profile/${item.userId}`);
                    }
                    break;
                  case 'mention':
                  case 'tag':
                    // Navigate to the post where user was mentioned/tagged
                    if (item.relatedPostId) {
                      router.push('/(tabs)/');
                    }
                    break;
                }
                
                // Mark as read when tapped
                markAsRead(item.id);
              }}
              onAction={handleNotificationAction}
            />
          )}
          style={styles.notificationsList}
          contentContainerStyle={filteredNotifications.length === 0 ? styles.emptyListContent : undefined}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {activeTab === 'all' ? '' : activeTab} notifications
              </Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  tabsWrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingVertical: 8,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.gray[50],
    gap: 4,
    height: 32,
  },
  activeTab: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  notificationsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationsList: {
    flex: 1,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});