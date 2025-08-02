import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Notification, UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { Heart, MessageCircle, UserPlus, Handshake, Briefcase, Check, X, Mail } from 'lucide-react-native';

interface NotificationItemProps {
  notification: Notification;
  user: UserProfile;
  onPress: () => void;
  onAction?: (notificationId: string, action: 'accept' | 'deny' | 'follow_back') => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  user,
  onPress,
  onAction,
}) => {
  // Format the time
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    
    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - notificationDate.getTime();
    
    // Convert to minutes, hours, days
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return notificationDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Use a placeholder image if no profile image is available
  const profileImage = user.profileImage || user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Get the icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={16} color={colors.error} fill={colors.error} />;
      case 'comment':
        return <MessageCircle size={16} color={colors.primary} />;
      case 'follow':
        return <UserPlus size={16} color={colors.primary} />;
      case 'collab_request':
        return <Handshake size={16} color={colors.secondary} />;
      case 'job_application':
        return <Briefcase size={16} color={colors.primary} />;
      case 'message':
        return <Mail size={16} color={colors.secondary} />;
      default:
        return null;
    }
  };

  // Render action buttons based on notification type
  const renderActionButtons = () => {
    if (!onAction) return null;

    switch (notification.type) {
      case 'collab_request':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => onAction(notification.id, 'accept')}
            >
              <Handshake size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.denyButton]}
              onPress={() => onAction(notification.id, 'deny')}
            >
              <X size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        );
      case 'follow':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.followButton]}
            onPress={() => onAction(notification.id, 'follow_back')}
          >
            <Text style={styles.followButtonText}>Follow Back</Text>
          </TouchableOpacity>
        );
      case 'job_application':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => onAction(notification.id, 'accept')}
            >
              <Check size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.denyButton]}
              onPress={() => onAction(notification.id, 'deny')}
            >
              <X size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.read && styles.unreadContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: profileImage }} style={styles.avatar} />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            {getNotificationIcon()}
          </View>
          
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        
        <Text style={styles.time}>
          {formatTime(notification.createdAt)}
        </Text>
      </View>
      
      {renderActionButtons()}
      
      {!notification.read && !renderActionButtons() && (
        <View style={styles.unreadDot} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    minHeight: 72,
  },
  unreadContainer: {
    backgroundColor: colors.gray[25],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 32,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 12,
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  denyButton: {
    backgroundColor: colors.error,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  followButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NotificationItem;