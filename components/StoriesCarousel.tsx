import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Story, UserProfile } from '@/types';
import { colors } from '@/constants/colors';
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
              <Plus size={16} color={colors.white} />
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
                    <BadgeCheck size={16} color={colors.verified} fill="none" />
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
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addStoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 72,
  },
  addStoryImageContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 4,
    borderWidth: 3,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  addStoryText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 72,
  },
  storyImageContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unviewedStory: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  viewedStory: {
    borderWidth: 3,
    borderColor: colors.gray[300],
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  multipleStoriesIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  multipleStoriesText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
});

export default StoriesCarousel;