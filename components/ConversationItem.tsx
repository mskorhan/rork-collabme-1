import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Conversation, UserProfile } from '@/types';
import { colors } from '@/constants/colors';

interface ConversationItemProps {
  conversation: Conversation;
  otherUser: UserProfile;
  unreadCount?: number;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  otherUser,
  unreadCount = 0,
  onPress,
}) => {
  // Format the time
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // If the message is from today, show the time
    if (
      now.getDate() === messageDate.getDate() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getFullYear() === messageDate.getFullYear()
    ) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // If the message is from this week, show the day
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // Otherwise, show the date
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Use profile image from user data or fallback
  const profileImage = otherUser.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        unreadCount > 0 && styles.unreadContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        {/* Online indicator */}
        <View style={styles.onlineIndicator} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[
            styles.name,
            unreadCount > 0 && styles.unreadName
          ]} numberOfLines={1}>
            {otherUser.name}
          </Text>
          {conversation.lastMessage && (
            <Text style={[
              styles.time,
              unreadCount > 0 && styles.unreadTime
            ]}>
              {formatTime(conversation.lastMessage.createdAt || Date.now())}
            </Text>
          )}
        </View>
        
        <View style={styles.messageContainer}>
          {conversation.lastMessage && (
            <Text 
              style={[
                styles.lastMessage,
                unreadCount > 0 && styles.unreadMessage
              ]} 
              numberOfLines={2}
            >
              {conversation.lastMessage.content}
            </Text>
          )}
          
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[100],
  },
  unreadContainer: {
    backgroundColor: colors.gray[50],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[200],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  unreadName: {
    fontWeight: '700',
  },
  time: {
    fontSize: 13,
    color: colors.gray[500],
    fontWeight: '500',
  },
  unreadTime: {
    color: colors.primary,
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 15,
    color: colors.gray[600],
    flex: 1,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '500',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});

export default ConversationItem;