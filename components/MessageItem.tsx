import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Message, UserProfile } from '@/types';
import { colors } from '@/constants/colors';

interface MessageItemProps {
  message: Message;
  sender: UserProfile;
  isCurrentUser: boolean;
  onPress?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  sender,
  isCurrentUser,
  onPress,
}) => {
  // Format the time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Use a placeholder image if no profile image is available
  const profileImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {!isCurrentUser && (
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      )}
      
      <View 
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}
      >
        {message.type === 'text' && (
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {message.content}
          </Text>
        )}
        
        {message.type === 'image' && (
          <Image 
            source={{ uri: message.content }} 
            style={styles.imageContent} 
            resizeMode="cover" 
          />
        )}
        
        <Text style={[
          styles.timestamp,
          isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
        ]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    paddingBottom: 24,
  },
  currentUserMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: colors.gray[200],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: colors.white,
  },
  otherUserText: {
    color: colors.text,
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 10,
    position: 'absolute',
    bottom: 6,
    right: 12,
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: colors.gray[500],
  },
});

export default MessageItem;