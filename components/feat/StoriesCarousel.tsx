import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Story, UserProfile } from '@/types';
import { theme } from '@/constants/theme';
import { BadgeCheck, Plus } from 'lucide-react-native';
import { getUsersWithStories, getStoriesByUser } from '@/mocks/stories';

interface StoriesCarouselProps {
  stories: Story[];
  users: UserProfile[];
  currentUserId: string;
  onStoryPress: (story: Story, user: UserProfile) => void;
  onAddStoryPress: () => void;
}

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({
  stories,
  users,
  currentUserId,
  onStoryPress,
  onAddStoryPress,
}) => {
  const getUserById = (userId: string): UserProfile | undefined => {
    return users.find(user => user.id === userId);
  };

  const getActiveStories = () => {
    const now = Date.now();
    return stories.filter(story => story.expiresAt > now);
  };

  // Get unique users with stories and their latest story
  const usersWithStories = getUsersWithStories();
  const userStoriesMap = usersWithStories.map(userId => {
    const userStories = getStoriesByUser(userId);
    const latestStory = userStories[userStories.length - 1]; // Get the most recent story
    return { userId, story: latestStory, user: getUserById(userId) };
  }).filter(item => item.user && item.story);
  
  const currentUser = getUserById(currentUserId);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Story Button */}
        <TouchableOpacity style={styles.addStoryContainer} onPress={onAddStoryPress}>
          <View style={styles.addStoryImageContainer}>
            <Image 
              source={{ uri: currentUser?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.addStoryImage} 
            />
            <View style={styles.addButton}>
              <Plus size={16} color={theme.colors.white} />
            </View>
          </View>
          <Text style={styles.addStoryText}>Your Story</Text>
        </TouchableOpacity>

        {/* Stories */}
        {userStoriesMap.map(({ userId, story, user }) => {
          if (!user || !story) return null;

          // Check if user has any unviewed stories
          const userStories = getStoriesByUser(userId);
          const hasUnviewedStories = userStories.some(s => !s.viewers || !s.viewers.includes(currentUserId));

          return (
            <TouchableOpacity
              key={userId}
              style={styles.storyContainer}
              onPress={() => onStoryPress(story, user)}
            >
              <View style={[
                styles.storyImageContainer,
                hasUnviewedStories ? styles.unviewedStory : styles.viewedStory
              ]}>
                <Image 
                  source={{ uri: user.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }} 
                  style={styles.storyImage} 
                />
                {user.isVerified && (
                  <View style={styles.verificationBadge}>
                    <BadgeCheck size={16} color={theme.colors.verified} fill="none" />
                  </View>
                )}
              </View>
              <Text style={styles.storyText} numberOfLines={1}>
                {user.name.split(' ')[0]}
              </Text>
              {userStories.length > 1 && (
                <View style={styles.multipleStoriesIndicator}>
                  <Text style={styles.multipleStoriesText}>{userStories.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral200,
    ...theme.shadows.sm,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  addStoryContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 70,
  },
  addStoryImageContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: theme.spacing.xs,
  },
  addStoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: theme.spacing.sm + 2,
    backgroundColor: theme.colors.primary500,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  addStoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 70,
  },
  storyImageContainer: {
    position: 'relative',
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    marginBottom: theme.spacing.xs,
  },
  unviewedStory: {
    backgroundColor: theme.colors.primary500,
  },
  viewedStory: {
    backgroundColor: theme.colors.neutral300,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.sm + 2,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  multipleStoriesIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.primary500,
    borderRadius: theme.spacing.sm + 2,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  multipleStoriesText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
});

export default StoriesCarousel;