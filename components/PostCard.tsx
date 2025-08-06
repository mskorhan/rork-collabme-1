import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Post, UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { ThumbsUp, MessageCircle, SquareArrowOutUpRight, BadgeCheck, Play, Pause, RotateCcw, FileText, Volume2, Maximize2 } from 'lucide-react-native';
import StarRating from '@/components/StarRating';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { router } from 'expo-router';

interface PostCardProps {
  post: Post;
  user?: UserProfile;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;

  onFullScreen?: (mediaUrl: string, type: 'photo' | 'video') => void;
  onProfilePress: () => void;
  isLiked?: boolean;

}

const { width } = Dimensions.get('window');
const POST_ASPECT_RATIO = 5 / 4; // 4:5 aspect ratio (height/width)
const POST_HEIGHT = (width - 24) * POST_ASPECT_RATIO; // Subtract margins (12px on each side)

const PostCard: React.FC<PostCardProps> = ({
  post,
  user,
  onLike,
  onComment,
  onShare,
  onProfilePress,
  isLiked = false,
  onFullScreen,
}) => {
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const lastTapRef = useRef(0); // For web double tap detection
  
  // Animation values - always initialize at top level
  const likeScale = useSharedValue(1);
  const likeRotation = useSharedValue(0);
  const likeOpacity = useSharedValue(1);
  const doubleTapScale = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);
  
  // Handle double tap like with enhanced animation and confetti effect
  const handleDoubleTapLike = React.useCallback(() => {
    if (!isLiked) {
      onLike();
    }
    
    // Show floating like animation with confetti
    setShowLikeAnimation(true);
    
    // Main double-tap animation
    doubleTapScale.value = withSequence(
      withSpring(0, { duration: 0 }),
      withSpring(1.8, { duration: 400 }),
      withTiming(0, { duration: 300 }, () => {
        runOnJS(setShowLikeAnimation)(false);
      })
    );
    
    // Confetti burst effect
    confettiScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withSpring(2, { duration: 500 }),
      withTiming(0, { duration: 200 })
    );
  }, [isLiked, onLike, doubleTapScale, confettiScale]);
  
  // Double tap gesture - always initialize
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleDoubleTapLike)();
    });

  // Animated styles - always initialize at top level
  const likeButtonStyle = useAnimatedStyle(() => {
    const rotateZ = `${likeRotation.value}deg`;
    
    return {
      transform: [
        { scale: likeScale.value },
        { rotateZ }
      ],
      opacity: likeOpacity.value,
    };
  });

  const doubleTapAnimationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      doubleTapScale.value,
      [0, 0.5, 1, 1.5, 2],
      [0, 0.8, 1, 0.8, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale: doubleTapScale.value }],
      opacity,
    };
  });

  const heartAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const confettiAnimationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      confettiScale.value,
      [0, 0.5, 1, 2],
      [0, 1, 0.8, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale: confettiScale.value }],
      opacity,
    };
  });
  
  // If user is not found, show a fallback
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </View>
    );
  }
  
  // Format the date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for audio player
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use profile image from user data or fallback
  const profileImage = user?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Get user type for display
  const getUserType = () => {
    // Check if user has role (creative) or companyType (company)
    const userWithRole = user as any;
    if (userWithRole.role) {
      return userWithRole.role.charAt(0).toUpperCase() + userWithRole.role.slice(1).replace('_', ' ');
    } else if (userWithRole.companyType) {
      return userWithRole.companyType.split('_').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return 'Creative';
  };

  // Handle single tap like with enhanced animation
  const handleLike = () => {
    // Professional like animation sequence
    likeScale.value = withSequence(
      withSpring(0.8, { duration: 100 }),
      withSpring(1.2, { duration: 150 }),
      withSpring(1, { duration: 100 })
    );
    
    likeRotation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(isLiked ? 0 : 15, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    
    likeOpacity.value = withSequence(
      withTiming(0.6, { duration: 50 }),
      withTiming(1, { duration: 100 })
    );
    
    // Trigger haptic-like visual feedback
    if (!isLiked) {
      heartScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.5, { duration: 300 }),
        withTiming(0, { duration: 200 })
      );
      
      heartOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 300 })
      );
    }
    
    onLike();
  };



  // Handle hashtag and mention clicks
  const handleHashtagPress = (hashtag: string) => {
    console.log('Navigate to hashtag:', hashtag);
    // In a real app, navigate to hashtag search
  };

  const handleMentionPress = (mention: string) => {
    console.log('Navigate to user:', mention);
    // In a real app, navigate to user profile
  };

  // Parse text for hashtags and mentions
  const parseText = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <TouchableOpacity key={index} onPress={() => handleHashtagPress(part)}>
            <Text style={styles.hashtag}>{part}</Text>
          </TouchableOpacity>
        );
      } else if (part.startsWith('@')) {
        return (
          <TouchableOpacity key={index} onPress={() => handleMentionPress(part)}>
            <Text style={styles.mention}>{part}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index} style={styles.captionText}>{part}</Text>;
    });
  };

  // Audio player controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };



  const renderContent = () => {
    switch (post.type) {
      case 'photo':
        return (
          <View style={styles.imageContainer}>
            {Platform.OS !== 'web' ? (
              <GestureDetector gesture={doubleTap}>
                <Image 
                  source={{ uri: post.content }} 
                  style={styles.postImage} 
                  resizeMode="cover" 
                />
              </GestureDetector>
            ) : (
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {
                  // Simple double tap detection for web
                  const now = Date.now();
                  if (now - lastTapRef.current < 300) {
                    handleDoubleTapLike();
                  }
                  lastTapRef.current = now;
                }}
              >
                <Image 
                  source={{ uri: post.content }} 
                  style={styles.postImage} 
                  resizeMode="cover" 
                />
              </TouchableOpacity>
            )}
            
            {/* Full screen button */}
            {onFullScreen && (
              <TouchableOpacity 
                style={styles.fullScreenButton}
                onPress={() => onFullScreen(post.content || '', 'photo')}
                activeOpacity={0.7}
              >
                <Maximize2 size={20} color={colors.white} />
              </TouchableOpacity>
            )}
            
            {/* Single tap heart animation */}
            <Animated.View style={[styles.heartAnimation, heartAnimationStyle]}>
              <ThumbsUp size={40} color={colors.primary} fill={colors.primary} />
            </Animated.View>
            
            {/* Double-tap like animation overlay */}
            {showLikeAnimation && (
              <Animated.View style={[styles.doubleTapAnimation, doubleTapAnimationStyle]}>
                <ThumbsUp size={80} color={colors.primary} fill={colors.primary} />
              </Animated.View>
            )}
            
            {/* Confetti effect */}
            {showLikeAnimation && (
              <Animated.View style={[styles.confettiAnimation, confettiAnimationStyle]}>
                <View style={styles.confettiContainer}>
                  {[...Array(8)].map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.confettiPiece, 
                        { 
                          backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
                          transform: [
                            { rotate: `${i * 45}deg` },
                            { translateX: (i % 2 === 0 ? 1 : -1) * 30 },
                            { translateY: (i % 3 === 0 ? 1 : -1) * 20 }
                          ]
                        }
                      ]} 
                    />
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        );

      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image 
              source={{ uri: post.content }} 
              style={styles.postImage} 
              resizeMode="cover" 
            />
            <View style={styles.videoOverlay}>
              <TouchableOpacity style={styles.playButton}>
                <Play size={40} color={colors.white} fill={colors.white} />
              </TouchableOpacity>
            </View>
            
            {/* Full screen button */}
            {onFullScreen && (
              <TouchableOpacity 
                style={styles.fullScreenButton}
                onPress={() => onFullScreen(post.content || '', 'video')}
                activeOpacity={0.7}
              >
                <Maximize2 size={20} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        );

      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <View style={styles.audioHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }} 
                style={styles.albumArt} 
              />
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>Audio Track</Text>
                <Text style={styles.audioArtist}>{user.name}</Text>
                <Text style={styles.audioDuration}>{formatTime(duration)}</Text>
              </View>
              <Volume2 size={24} color={colors.primary} />
            </View>
            
            <View style={styles.audioControls}>
              <TouchableOpacity style={styles.audioButton} onPress={handleRestart}>
                <RotateCcw size={20} color={colors.gray[600]} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
                {isPlaying ? (
                  <Pause size={24} color={colors.white} />
                ) : (
                  <Play size={24} color={colors.white} fill={colors.white} />
                )}
              </TouchableOpacity>
              
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(currentTime / duration) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        );

      case 'pdf':
        return (
          <View style={styles.pdfContainer}>
            {/* PDF Preview */}
            <View style={styles.pdfPreview}>
              <Image 
                source={{ uri: post.content || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }}
                style={styles.pdfPreviewImage}
                resizeMode="cover"
              />
              <View style={styles.pdfOverlay}>
                <FileText size={40} color={colors.white} />
                <Text style={styles.pdfOverlayText}>PDF Document</Text>
              </View>
            </View>
            
            <View style={styles.pdfHeader}>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfTitle}>{post.description || 'Document.pdf'}</Text>
                <Text style={styles.pdfSize}>2.4 MB • 12 pages</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.pdfButton}>
              <Text style={styles.pdfButtonText}>Open Document</Text>
            </TouchableOpacity>
            
            {/* Full screen button */}
            {onFullScreen && (
              <TouchableOpacity 
                style={styles.fullScreenButton}
                onPress={() => onFullScreen(post.content || '', 'photo')}
                activeOpacity={0.7}
              >
                <Maximize2 size={20} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        );

      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={() => router.push(`/profile/${user.id}`)}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {user.isVerified && (
              <View style={styles.verificationBadge}>
                <BadgeCheck size={16} color={colors.verified} fill="none" />
              </View>
            )}
          </View>
          <View>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.userType}>{getUserType()}</Text>
            {user.rating && (
              <StarRating 
                rating={user.rating} 
                size={12} 
                showValue={true}
                style={styles.userRating}
              />
            )}
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        
        {/* Sponsored tag for ads */}
        {(post as any).isSponsored && (
          <View style={styles.sponsoredTag}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        )}
      </View>
      
      {/* Content */}
      {renderContent()}
      
      {/* Caption */}
      {post.description && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            {parseText(post.description)}
          </Text>
        </View>
      )}
      
      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.hashtagContainer}>
          {post.hashtags.map((tag, index) => (
            <TouchableOpacity key={index} onPress={() => handleHashtagPress(`#${tag}`)}>
              <Text style={styles.hashtagTag}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statText}>{post.likes.length} likes</Text>
        <Text style={styles.statText}>{post.comments.length} comments</Text>
      </View>
      
      {/* Actions */}
      <View style={styles.actions}>
        <Animated.View style={likeButtonStyle}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <ThumbsUp 
              size={24} 
              color={isLiked ? colors.primary : colors.gray[500]} 
              fill={isLiked ? colors.primary : 'none'} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onComment} 
          activeOpacity={0.7}
        >
          <MessageCircle size={24} color={colors.gray[500]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <SquareArrowOutUpRight size={24} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.gray[500],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userType: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
  },
  userRating: {
    marginTop: 2,
    marginBottom: 2,
  },
  sponsoredTag: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sponsoredText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: POST_HEIGHT,
    borderRadius: 12,
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioContainer: {
    backgroundColor: colors.gray[50],
    padding: 16,
    margin: 12,
    borderRadius: 12,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  audioArtist: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 2,
  },
  audioDuration: {
    fontSize: 12,
    color: colors.gray[500],
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioButton: {
    padding: 8,
    marginRight: 16,
  },
  playPauseButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  pdfContainer: {
    backgroundColor: colors.gray[50],
    padding: 16,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pdfInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  pdfSize: {
    fontSize: 14,
    color: colors.gray[600],
  },
  pdfButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    zIndex: 5,
  },
  doubleTapAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 10,
  },
  confettiAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    zIndex: 8,
  },
  confettiContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  captionText: {
    fontSize: 14,
    color: colors.text,
  },
  hashtag: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  mention: {
    fontSize: 14,
    color: colors.verified,
    fontWeight: '500',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  hashtagTag: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.gray[600],
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButton: {
    padding: 8,
    marginRight: 16,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fullScreenButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfPreview: {
    position: 'relative',
    height: POST_HEIGHT,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pdfPreviewImage: {
    width: '100%',
    height: '100%',
  },
  pdfOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfOverlayText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default PostCard;