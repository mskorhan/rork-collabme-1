import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Story, UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { X, BadgeCheck, Send, Heart, ThumbsUp, Laugh, Angry, Ban, Sunrise } from 'lucide-react-native';
import { getStoriesByUser, getUsersWithStories } from '@/mocks/stories';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS,
  withSpring,
  withSequence,
  interpolate
} from 'react-native-reanimated';

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  users: UserProfile[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryComplete: (storyId: string) => void;
}

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  stories,
  users,
  initialStoryIndex,
  onClose,
  onStoryComplete,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  
  const progressWidth = useSharedValue(0);
  const replyBoxTranslateY = useSharedValue(200);
  const emojiScale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const thumbsUpScale = useSharedValue(1);
  const laughScale = useSharedValue(1);
  const angryScale = useSharedValue(1);
  const sadScale = useSharedValue(1);
  const surpriseScale = useSharedValue(1);
  
  const textInputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Get unique users with stories
  const usersWithStories = getUsersWithStories();
  const currentUserId = usersWithStories[currentUserIndex];
  const currentUserStories = getStoriesByUser(currentUserId);
  const currentStory = currentUserStories[currentStoryIndex];
  const currentUser = users.find(user => user.id === currentUserId);
  
  // Initialize based on the initial story
  useEffect(() => {
    if (visible && stories[initialStoryIndex]) {
      const initialStory = stories[initialStoryIndex];
      const userIndex = usersWithStories.findIndex(userId => userId === initialStory.userId);
      const userStories = getStoriesByUser(initialStory.userId);
      const storyIndex = userStories.findIndex(story => story.id === initialStory.id);
      
      setCurrentUserIndex(Math.max(0, userIndex));
      setCurrentStoryIndex(Math.max(0, storyIndex));
    }
  }, [visible, initialStoryIndex]);
  
  useEffect(() => {
    if (!visible || !currentStory || isPaused) return;
    
    setProgress(0);
    progressWidth.value = 0;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (STORY_DURATION / 100));
        progressWidth.value = withTiming(newProgress, { duration: 100 });
        
        if (newProgress >= 100) {
          clearInterval(timer);
          runOnJS(handleNextStory)();
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    timerRef.current = timer as ReturnType<typeof setInterval>;
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, currentUserIndex, currentStoryIndex, isPaused]);
  
  const handleNextStory = () => {
    if (currentStory) {
      onStoryComplete(currentStory.id);
    }
    
    // Check if there are more stories for current user
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Move to next user's stories
      if (currentUserIndex < usersWithStories.length - 1) {
        setCurrentUserIndex(currentUserIndex + 1);
        setCurrentStoryIndex(0);
      } else {
        onClose();
      }
    }
  };
  
  const handlePrevStory = () => {
    // Check if there are previous stories for current user
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      // Move to previous user's stories
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1;
        const prevUserStories = getStoriesByUser(usersWithStories[prevUserIndex]);
        setCurrentUserIndex(prevUserIndex);
        setCurrentStoryIndex(prevUserStories.length - 1);
      }
    }
  };
  
  const handleTapStory = () => {
    handleNextStory();
  };
  
  // Make sure the close button works properly
  const handleCloseStory = () => {
    console.log('Close button pressed');
    setIsReplying(false);
    setReplyText('');
    setIsPaused(false);
    onClose();
  };
  
  const handleReplyPress = () => {
    setIsReplying(true);
    setIsPaused(true);
    replyBoxTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 300);
  };
  
  const handleCloseReply = () => {
    setIsReplying(false);
    setIsPaused(false);
    setReplyText('');
    replyBoxTranslateY.value = withSpring(200);
    textInputRef.current?.blur();
  };
  
  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    Alert.alert('Reply Sent!', `Your reply "${replyText}" has been sent to ${currentUser?.name}`);
    handleCloseReply();
  };
  
  const handleEmojiReaction = (emoji: string, scale: Animated.SharedValue<number>) => {
    // Animate the emoji
    scale.value = withSequence(
      withSpring(1.5, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    
    // Show success message
    Alert.alert('Reaction Sent!', `You reacted with ${emoji} to ${currentUser?.name}'s story`);
  };
  
  // Always define animated styles (for React Hooks rules)
  const progressStyle = useAnimatedStyle(() => ({
    width: Platform.OS !== 'web' ? `${progressWidth.value}%` : `${progress}%`,
  }));
  
  const replyBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Platform.OS !== 'web' ? replyBoxTranslateY.value : (isReplying ? 0 : 200) }],
  }));
  
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? heartScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  const thumbsUpAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? thumbsUpScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  const laughAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? laughScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  const angryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? angryScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  const sadAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? sadScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  const surpriseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Platform.OS !== 'web' ? surpriseScale.value : 1 }],
    opacity: Platform.OS !== 'web' ? 1 : 0,
  }));
  
  if (!visible || !currentStory || !currentUser) {
    return null;
  }
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <Image 
          source={{ uri: currentStory.content || currentStory.mediaUrl }} 
          style={styles.storyImage}
          resizeMode="cover"
        />
        
        <SafeAreaView style={styles.overlay}>
          {/* Progress bars - one for each story of current user */}
          <View style={styles.progressContainer}>
            {currentUserStories.map((_, index) => (
              <View key={index} style={styles.progressBarBackground}>
                {index === currentStoryIndex && (
                  Platform.OS !== 'web' ? (
                    <Animated.View style={[styles.progressBar, progressStyle]} />
                  ) : (
                    <View style={[styles.progressBar, progressStyle]} />
                  )
                )}
                {index < currentStoryIndex && (
                  <View style={[styles.progressBar, styles.completedProgress]} />
                )}
              </View>
            ))}
          </View>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: currentUser.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }} 
                  style={styles.profileImage} 
                />
                {currentUser.isVerified && (
                  <View style={styles.verificationBadge}>
                    <BadgeCheck size={16} color={colors.verified} fill={colors.verified} />
                  </View>
                )}
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.username}>{currentUser.name}</Text>
                <Text style={styles.timeAgo}>
                  {Math.floor((Date.now() - Number(currentStory.createdAt)) / (1000 * 60 * 60))}h ago
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleCloseStory} 
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          {/* Touch areas for navigation - positioned below header */}
          {!isReplying && (
            <View style={styles.touchAreasContainer}>
              <TouchableOpacity 
                style={styles.leftTouchArea} 
                onPress={handlePrevStory}
                activeOpacity={1}
              />
              <TouchableOpacity 
                style={styles.centerTouchArea} 
                onPress={handleTapStory}
                activeOpacity={1}
              />
              <TouchableOpacity 
                style={styles.rightTouchArea} 
                onPress={handleNextStory}
                activeOpacity={1}
              />
            </View>
          )}
          
          {/* Reply Button */}
          {!isReplying && (
            <View style={styles.replyButtonContainer}>
              <TouchableOpacity 
                style={styles.replyButton}
                onPress={handleReplyPress}
                activeOpacity={0.8}
              >
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
        
        {/* Reply Interface */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.replyContainer}
        >
          {Platform.OS !== 'web' ? (
            <Animated.View style={[styles.replyBox, replyBoxStyle]}>
              {/* Quick Emoji Reactions */}
              <View style={styles.emojiContainer}>
                <Animated.View style={[styles.emojiButton, heartAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('❤️', heartScale)}>
                    <Heart size={24} color={colors.error} fill={colors.error} />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={[styles.emojiButton, thumbsUpAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('👍', thumbsUpScale)}>
                    <ThumbsUp size={24} color={colors.primary} fill={colors.primary} />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={[styles.emojiButton, laughAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('😂', laughScale)}>
                    <Laugh size={24} color={colors.warning} />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={[styles.emojiButton, surpriseAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('😮', surpriseScale)}>
                    <Sunrise size={24} color={colors.secondary} />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={[styles.emojiButton, sadAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('😢', sadScale)}>
                    <Ban size={24} color={colors.gray[600]} />
                  </TouchableOpacity>
                </Animated.View>
                
                <Animated.View style={[styles.emojiButton, angryAnimatedStyle]}>
                  <TouchableOpacity onPress={() => handleEmojiReaction('😠', angryScale)}>
                    <Angry size={24} color={colors.error} />
                  </TouchableOpacity>
                </Animated.View>
              </View>
              
              {/* Message Input */}
              <View style={styles.messageInputContainer}>
                <TextInput
                  ref={textInputRef}
                  style={styles.messageInput}
                  placeholder={`Reply to ${currentUser?.name}...`}
                  placeholderTextColor={colors.gray[400]}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  maxLength={200}
                />
                <View style={styles.messageActions}>
                  <TouchableOpacity 
                    style={styles.closeReplyButton}
                    onPress={handleCloseReply}
                  >
                    <X size={20} color={colors.gray[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      replyText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                    ]}
                    onPress={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send size={20} color={replyText.trim() ? colors.white : colors.gray[400]} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ) : (
            <View style={[styles.replyBox, { transform: [{ translateY: isReplying ? 0 : 200 }] }]}>
              {/* Web fallback - same content without animations */}
              <View style={styles.emojiContainer}>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('❤️', heartScale)}>
                  <Heart size={24} color={colors.error} fill={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('👍', thumbsUpScale)}>
                  <ThumbsUp size={24} color={colors.primary} fill={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('😂', laughScale)}>
                  <Laugh size={24} color={colors.warning} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('😮', surpriseScale)}>
                  <Sunrise size={24} color={colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('😢', sadScale)}>
                  <Ban size={24} color={colors.gray[600]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton} onPress={() => handleEmojiReaction('😠', angryScale)}>
                  <Angry size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.messageInputContainer}>
                <TextInput
                  ref={textInputRef}
                  style={styles.messageInput}
                  placeholder={`Reply to ${currentUser?.name}...`}
                  placeholderTextColor={colors.gray[400]}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  maxLength={200}
                />
                <View style={styles.messageActions}>
                  <TouchableOpacity 
                    style={styles.closeReplyButton}
                    onPress={handleCloseReply}
                  >
                    <X size={20} color={colors.gray[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      replyText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                    ]}
                    onPress={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send size={20} color={replyText.trim() ? colors.white : colors.gray[400]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  storyImage: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  completedProgress: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.white,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  timeAgo: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  closeButton: {
    padding: 8,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    elevation: 10, // For Android
  },
  touchAreasContainer: {
    position: 'absolute',
    top: 100, // Start below the header area
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftTouchArea: {
    flex: 1,
    maxWidth: '25%',
  },
  centerTouchArea: {
    flex: 2,
    maxWidth: '50%',
  },
  rightTouchArea: {
    flex: 1,
    maxWidth: '25%',
  },
  replyButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  replyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  replyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  replyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  replyBox: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.gray[100],
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    marginRight: 12,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeReplyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.gray[200],
  },
});

export default StoryViewer;