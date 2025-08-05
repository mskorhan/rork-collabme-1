import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Text, Image, Platform, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Send, Smile, Plus, Phone, Video, Info, Image as ImageIcon, File, Mic, Camera } from 'lucide-react-native';
import BackButton from '@/components/BackButton';
import { mockConversations, mockMessages } from '@/mocks/conversations';
import { mockUsers } from '@/mocks/users';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messageText, setMessageText] = useState('');
  const [quickReactions] = useState(['👍', '❤️', '😂', '😮', '😢', '😡']);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Clear previous messages and fetch new ones when conversationId changes
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setMessages([]); // Clear previous messages
      
      // Simulate API call to fetch messages
      setTimeout(() => {
        const conversationMessages = mockMessages.filter(m => m.conversationId === id);
        setMessages(conversationMessages);
        setIsLoading(false);
      }, 300);
    }
  }, [id]);
  
  const conversation = mockConversations.find(c => c.id === id);
  if (!conversation) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
            headerBackVisible: false
          }} 
        />
        <View style={styles.header}>
          <BackButton onPress={() => router.replace('/messages')} />
          <Text style={styles.headerTitle}>Conversation not found</Text>
        </View>
      </View>
    );
  }

  const otherUser = getOtherUserInConversation(id, '1');

  function getOtherUserInConversation(conversationId: string, currentUserId: string) {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation) return mockUsers[0];
    
    const otherUserId = conversation.participants.find((id: string) => id !== currentUserId);
    return mockUsers.find(user => user.id === otherUserId) || mockUsers[0];
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, send the message
      console.log('Sending message:', messageText);
      setMessageText('');
      
      // Simulate adding a new message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  const handleAttachmentPress = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };
  
  const handleAttachmentOption = (type: string) => {
    // Handle different attachment types
    Alert.alert('Attachment', `${type} attachment selected`);
    setShowAttachmentOptions(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          headerBackVisible: false
        }} 
      />
      
      {/* Message Header */}
      <View style={styles.messageHeader}>
        <BackButton onPress={() => router.back()} style={styles.headerBackButton} />
        
        <View style={styles.headerUserInfo}>
          <Image 
            source={{ uri: otherUser.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
            style={styles.messageHeaderAvatar}
          />
          <View style={styles.messageHeaderInfo}>
            <Text style={styles.messageHeaderName}>{otherUser.name}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.messageHeaderStatus}>Active now</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Phone size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Video size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Info size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === '1';
            const prevMessage = messages[index - 1];
            const showAvatar = !isOwnMessage && (!prevMessage || prevMessage.senderId !== message.senderId);
            const showTimestamp = index === messages.length - 1 || 
              (messages[index + 1] && 
               messages[index + 1].createdAt - message.createdAt > 300000); // 5 minutes
          
            return (
              <View 
                key={message.id}
                style={[
                  styles.messageItem,
                  isOwnMessage ? styles.ownMessage : styles.otherMessage
                ]}
              >
              {!isOwnMessage && (
                <View style={styles.avatarContainer}>
                  {showAvatar ? (
                    <Image 
                      source={{ uri: otherUser.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
                      style={styles.messageAvatar}
                    />
                  ) : (
                    <View style={styles.messageAvatarSpacer} />
                  )}
                </View>
              )}
              
              <View style={styles.messageContent}>
                <View style={[
                  styles.messageBubble,
                  isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                  ]}>
                    {message.content}
                  </Text>
                </View>
                
                {showTimestamp && (
                  <Text style={[
                    styles.messageTime,
                    isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
                  ]}>
                    {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Text>
                )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Quick Reactions */}
      <View style={styles.quickReactionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReactions}>
          {quickReactions.map((emoji, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickReactionButton}
              onPress={() => {
                setMessageText(messageText + emoji);
              }}
            >
              <Text style={styles.quickReactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Message Input */}
      {/* Attachment Options */}
      {showAttachmentOptions && (
        <View style={styles.attachmentOptions}>
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={() => handleAttachmentOption('Photo')}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#4CAF50' }]}>
              <ImageIcon size={20} color={colors.white} />
            </View>
            <Text style={styles.attachmentText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={() => handleAttachmentOption('Camera')}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#2196F3' }]}>
              <Camera size={20} color={colors.white} />
            </View>
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={() => handleAttachmentOption('Document')}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#FF9800' }]}>
              <File size={20} color={colors.white} />
            </View>
            <Text style={styles.attachmentText}>Document</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={() => handleAttachmentOption('Audio')}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#9C27B0' }]}>
              <Mic size={20} color={colors.white} />
            </View>
            <Text style={styles.attachmentText}>Audio</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.messageInputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={handleAttachmentPress}
        >
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Message..."
            placeholderTextColor={colors.gray[400]}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send size={18} color={messageText.trim() ? colors.white : colors.gray[400]} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  backButton: {
    padding: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageHeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  messageHeaderInfo: {
    flex: 1,
  },
  messageHeaderName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  messageHeaderStatus: {
    fontSize: 13,
    color: colors.gray[600],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    marginRight: 8,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageAvatarSpacer: {
    width: 28,
    height: 28,
  },
  messageContent: {
    flex: 1,
    maxWidth: '75%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
    alignSelf: 'flex-end',
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 6,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    color: colors.gray[500],
    marginTop: 4,
  },
  ownMessageTime: {
    textAlign: 'right',
  },
  otherMessageTime: {
    textAlign: 'left',
  },
  quickReactionsContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingVertical: 8,
  },
  quickReactions: {
    paddingHorizontal: 16,
  },
  quickReactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickReactionEmoji: {
    fontSize: 18,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    minHeight: 20,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.gray[300],
  },
  attachmentOptions: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    justifyContent: 'space-between',
  },
  attachmentOption: {
    alignItems: 'center',
    width: 70,
  },
  attachmentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  attachmentText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
  },
});