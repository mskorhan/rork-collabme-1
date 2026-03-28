import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Text, Alert, Image, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { MessageCircle, Plus, Image as ImageIcon, FileText, Camera, Music, X } from 'lucide-react-native';
import PostCard from '@/components/PostCard';
import StoriesCarousel from '@/components/StoriesCarousel';
import WallPostInput from '@/components/WallPostInput';
import StoryViewer from '@/components/StoryViewer';
import CommentsModal from '@/components/CommentsModal';
import { mockPosts } from '@/mocks/posts';
import { mockUsers } from '@/mocks/users';
import { mockStories } from '@/mocks/stories';
import { Post, UserProfile, Story, Comment as PostComment } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [fullScreenMedia, setFullScreenMedia] = useState<{url: string, type: 'photo' | 'video'} | null>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const currentUserId = '1'; // Current user ID

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh - reload posts
    setPosts([...mockPosts]);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Function to scroll to top and refresh
  const scrollToTopAndRefresh = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    onRefresh();
  };

  // Handle home tab press - scroll to top and refresh
  React.useEffect(() => {
    const handleTabPress = () => {
      scrollToTopAndRefresh();
    };
    
    // This effect will run when the component mounts
    // The tab press is handled in the _layout.tsx file
    return () => {};
  }, []);

  const handleLike = useCallback((postId: string) => {
    try {
      if (likedPosts.includes(postId)) {
        setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
        // Update post likes count
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likes.filter(id => id !== currentUserId)
            };
          }
          return post;
        }));
      } else {
        setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
        // Update post likes count
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: [...post.likes, currentUserId]
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  }, [currentUserId, likedPosts]);

  const handleSave = useCallback((postId: string) => {
    try {
      if (savedPosts.includes(postId)) {
        setSavedPosts(prevSavedPosts => prevSavedPosts.filter(id => id !== postId));
      } else {
        setSavedPosts(prevSavedPosts => [...prevSavedPosts, postId]);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Failed to save post. Please try again.');
    }
  }, [savedPosts]);

  const handlePost = useCallback((content: { text: string; type: 'text' | 'photo' | 'video' | 'audio' | 'pdf'; media?: string }) => {
    try {
      // Create a new post
      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUserId,
        type: content.type as any,
        content: content.media || content.text,
        description: content.text,
        hashtags: [],
        tags: [],
        mentions: [],
        likes: [],
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Add to the beginning of posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  }, [currentUserId, setPosts]);

  const handleStoryPress = (story: Story, user: UserProfile) => {
    const storyIndex = mockStories.findIndex(s => s.id === story.id);
    setSelectedStoryIndex(storyIndex);
    setStoryViewerVisible(true);
  };

  const handleAddStoryPress = () => {
    Alert.alert(
      'Add Story', 
      'Choose a story type to upload',
      [
        {
          text: 'Photo',
          onPress: () => console.log('Photo story selected')
        },
        {
          text: 'Video',
          onPress: () => console.log('Video story selected')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleStoryComplete = (storyId: string) => {
    if (!viewedStories.includes(storyId)) {
      setViewedStories([...viewedStories, storyId]);
    }
  };

  const handleMessagesPress = () => {
    router.push('/messages');
  };

  const handleFullScreen = (mediaUrl: string, type: 'photo' | 'video') => {
    setFullScreenMedia({ url: mediaUrl, type });
  };

  const closeFullScreen = () => {
    setFullScreenMedia(null);
  };

  const handleComment = useCallback((postId: string) => {
    try {
      setCurrentPostId(postId);
      setCommentModalVisible(true);
    } catch (error) {
      console.error('Error opening comment modal:', error);
      Alert.alert('Error', 'Failed to open comment modal. Please try again.');
    }
  }, []);

  const handleLikeComment = useCallback((commentId: string) => {
    try {
      if (!currentPostId) return;
      
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === currentPostId) {
          // Function to recursively update comments and their replies
          const updateCommentsWithLikes = (comments: PostComment[]): PostComment[] => {
            return comments.map(comment => {
              // If this is the comment to update
              if (comment.id === commentId) {
                const isLiked = comment.likes.includes(currentUserId);
                return {
                  ...comment,
                  likes: isLiked 
                    ? comment.likes.filter((id: string) => id !== currentUserId)
                    : [...comment.likes, currentUserId]
                };
              }
              
              // If this comment has replies, check them too
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentsWithLikes(comment.replies)
                };
              }
              
              // Otherwise return the comment unchanged
              return comment;
            });
          };
          
          return {
            ...post,
            comments: updateCommentsWithLikes(post.comments)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
      Alert.alert('Error', 'Failed to like comment. Please try again.');
    }
  }, [currentPostId, currentUserId]);

  const handleReplyComment = useCallback((commentId: string) => {
    try {
      // The actual implementation is in CommentsModal component
      // This function is just a pass-through to trigger the reply functionality
      // The CommentsModal handles setting the comment text and focusing the input
    } catch (error) {
      console.error('Error replying to comment:', error);
      Alert.alert('Error', 'Failed to reply to comment. Please try again.');
    }
  }, []);
  
  const handleAddReply = useCallback((parentCommentId: string, text: string) => {
    if (!text.trim() || !currentPostId) return;
    
    try {
      // Create a new reply
      const newReply = {
        id: Date.now().toString(),
        postId: currentPostId,
        userId: currentUserId,
        content: text,
        likes: [],
        replies: [],
        createdAt: Date.now(),
      };

      // Add reply to the parent comment (recursively checking nested comments)
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === currentPostId) {
          // Function to recursively update comments and their replies
          const updateCommentsWithReply = (comments: PostComment[]): PostComment[] => {
            return comments.map(comment => {
              // If this is the comment to update
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply]
                };
              }
              
              // If this comment has replies, check them too
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentsWithReply(comment.replies)
                };
              }
              
              // Otherwise return the comment unchanged
              return comment;
            });
          };
          
          return {
            ...post,
            comments: updateCommentsWithReply(post.comments)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding reply:', error);
      Alert.alert('Error', 'Failed to add reply. Please try again.');
    }
  }, [currentPostId, currentUserId]);

  const submitComment = useCallback((text: string) => {
    if (!text.trim() || !currentPostId) return;
    
    try {
      // Create a new comment
      const newComment = {
        id: Date.now().toString(),
        postId: currentPostId,
        userId: currentUserId,
        content: text,
        likes: [],
        replies: [],
        createdAt: Date.now(),
      };

      // Add comment to the post
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === currentPostId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
      
      // Show success toast or feedback (optional)
      // In a real app, you might want to use a toast notification instead of an alert
      // Alert.alert('Success', 'Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  }, [currentPostId, currentUserId]);



  const getUserById = (userId: string): UserProfile | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const renderHeader = () => (
    <View>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/YourLogoHere.png' }}
              style={styles.logo}
              resizeMode="contain"
              defaultSource={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM1NTlERkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNNZTwvdGV4dD4KPHN2Zz4K' }}
              onError={() => {
                // Fallback to text if image fails to load
                console.log('Logo failed to load, using text fallback');
              }}
            />
            <Text style={styles.logoText}>CMe</Text>
          </View>
          <TouchableOpacity style={styles.messagesButton} onPress={handleMessagesPress}>
            <MessageCircle size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <StoriesCarousel
        stories={mockStories}
        users={mockUsers}
        currentUserId={currentUserId}
        onStoryPress={handleStoryPress}
        onAddStoryPress={handleAddStoryPress}
      />
      <View style={styles.postInputContainer}>
        <WallPostInput onPost={handlePost} placeholder="Any new work recently?" />
      </View>
    </View>
  );



  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const user = getUserById(item.userId);
          return (
            <PostCard
              post={item}
              user={user}
              onLike={() => handleLike(item.id)}
              onComment={() => handleComment(item.id)}
              onShare={() => {}}
              onProfilePress={() => {}}
              isLiked={likedPosts.includes(item.id)}
              onFullScreen={handleFullScreen}
            />
          );
        }}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />





      <StoryViewer
        visible={storyViewerVisible}
        stories={mockStories}
        users={mockUsers}
        initialStoryIndex={selectedStoryIndex}
        onClose={() => setStoryViewerVisible(false)}
        onStoryComplete={handleStoryComplete}
      />

      {/* Full Screen Media Modal */}
      <Modal
        visible={!!fullScreenMedia}
        transparent
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.fullScreenCloseButton}
            onPress={closeFullScreen}
            activeOpacity={0.7}
          >
            <X size={24} color={colors.white} />
          </TouchableOpacity>
          {fullScreenMedia && (
            <Image 
              source={{ uri: fullScreenMedia.url }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Comment Modal */}
      <CommentsModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        post={currentPostId ? posts.find(p => p.id === currentPostId) || null : null}
        currentUserId={currentUserId}
        onAddComment={submitComment}
        onLikeComment={handleLikeComment}
        onReplyComment={handleReplyComment}
        onAddReply={handleAddReply}
        getUserById={getUserById}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  topBar: {
    backgroundColor: colors.white,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 32,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#559DFF',
    letterSpacing: -0.5,
    position: 'absolute',
  },
  messagesButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  listContent: {
    paddingBottom: 20,
  },
  postInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },


  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

});