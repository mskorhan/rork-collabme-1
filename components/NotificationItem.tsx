import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Notification, UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { ThumbsUp, MessageCircle, UserPlus, Handshake, Briefcase, X, Mail } from 'lucide-react-native';
import { formatTime } from '@/utils/formatTime';

interface NotificationItemProps {
  notification: Notification;
  user: UserProfile;
  onPress: () => void;
  onAction?: (notificationId: string, action: 'accept' | 'deny' | 'follow_back') => void;
  isProcessing?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  user,
  onPress,
  onAction,
  isProcessing = false,
}) => {

  
  // Use a placeholder image if no profile image is available
  const profileImage = user.profileImage || user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Get the icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <ThumbsUp size={16} color={colors.primary} fill={colors.primary} />;
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
              style={[styles.actionButton, styles.acceptButton, isProcessing && styles.disabledButton]}
              onPress={(e) => {
                if (isProcessing) return;
                e.stopPropagation(); // Prevent triggering parent onPress
                onAction(notification.id, 'accept');
              }}
              activeOpacity={isProcessing ? 1 : 0.8}
              disabled={isProcessing}
            >
              <Handshake size={14} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.denyButton, isProcessing && styles.disabledButton]}
              onPress={(e) => {
                if (isProcessing) return;
                e.stopPropagation(); // Prevent triggering parent onPress
                onAction(notification.id, 'deny');
              }}
              activeOpacity={isProcessing ? 1 : 0.8}
              disabled={isProcessing}
            >
              <X size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
        );
      case 'follow':
        return (
          <TouchableOpacity
            style={styles.followBackButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering parent onPress (navigation)
              onAction(notification.id, 'follow_back');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.followButtonText}>Follow Back</Text>
          </TouchableOpacity>
        );
      case 'job_application':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton, isProcessing && styles.disabledButton]}
              onPress={(e) => {
                if (isProcessing) return;
                e.stopPropagation(); // Prevent triggering parent onPress
                onAction(notification.id, 'accept');
              }}
              activeOpacity={isProcessing ? 1 : 0.8}
              disabled={isProcessing}
            >
              <Handshake size={14} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.denyButton, isProcessing && styles.disabledButton]}
              onPress={(e) => {
                if (isProcessing) return;
                e.stopPropagation(); // Prevent triggering parent onPress
                onAction(notification.id, 'deny');
              }}
              activeOpacity={isProcessing ? 1 : 0.8}
              disabled={isProcessing}
            >
              <X size={14} color={colors.white} />
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
          
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {notification.message}
            </Text>
            <Text style={styles.time}>
              {formatTime(notification.createdAt)}
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    minHeight: 'auto',
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
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 12,
    color: colors.gray[500],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  denyButton: {
    backgroundColor: colors.error,
  },
  followBackButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  followButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default NotificationItem;