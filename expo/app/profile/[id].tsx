import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft, MessageCircle, UserPlus, MapPin, BadgeCheck, Grid3X3, Play } from 'lucide-react-native';
import StarRating from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';
import { mockUsers, mockCreatives, mockCompanies } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { UserProfile, Post } from '@/types';
import PostCard from '@/components/PostCard';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'portfolio'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Mock current user ID - in real app this would come from auth
  const currentUserId = '1';

  // Find user from all user arrays
  const allUsers = [...mockUsers, ...mockCreatives, ...mockCompanies];
  const user = allUsers.find(u => u.id === id);
  
  // Get user's posts
  const userPosts = mockPosts.filter(post => post.userId === id);

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const profileImage = user.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Determine if this is a creative or company profile
  const isCreative = 'role' in user;
  const role = isCreative 
    ? (user as any).role?.charAt(0).toUpperCase() + (user as any).role?.slice(1)
    : (user as any).companyType?.split('_').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    router.push('/(tabs)/activity');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      user={user}
      onLike={() => {}}
      onComment={() => {}}
      onShare={() => {}}
      onSave={() => {}}
      onProfilePress={() => {}}
      isLiked={false}
      isSaved={false}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            {user.isVerified && (
              <BadgeCheck size={20} color={colors.verified} fill={colors.verified} />
            )}
          </View>
          
          <Text style={styles.role}>{role}</Text>
          
          {/* User Rating */}
          {user.rating && (
            <TouchableOpacity 
              style={styles.ratingContainer}
              onPress={() => setShowReviewModal(true)}
              activeOpacity={0.7}
            >
              <StarRating 
                rating={user.rating} 
                size={16} 
                showValue={true}
                style={styles.rating}
              />
            </TouchableOpacity>
          )}
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
          
          {(user as any).location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.gray[500]} />
              <Text style={styles.location}>
                {typeof (user as any).location === 'string' 
                  ? (user as any).location 
                  : `${(user as any).location.city}${(user as any).location.country ? `, ${(user as any).location.country}` : ''}`
                }
              </Text>
            </View>
          )}
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Array.isArray(user.followers) ? user.followers.length : 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Array.isArray(user.following) ? user.following.length : 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollow}
            >
              <UserPlus size={18} color={isFollowing ? colors.text : colors.white} />
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <MessageCircle size={18} color={colors.primary} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Grid3X3 size={20} color={activeTab === 'posts' ? colors.primary : colors.gray[500]} />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
            onPress={() => setActiveTab('portfolio')}
          >
            <Play size={20} color={activeTab === 'portfolio' ? colors.primary : colors.gray[500]} />
            <Text style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
              Portfolio
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            <FlatList
              key={`profile-${id}-posts-grid-${userPosts.length}`}
              data={userPosts}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.postRow}
              contentContainerStyle={styles.postsContainer}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.postGridItem}>
                  <Image source={{ uri: item.content }} style={styles.postGridImage} />
                  {item.type === 'video' && (
                    <View style={styles.videoOverlay}>
                      <View style={styles.playIcon}>
                        <Text style={styles.playIconText}>▶</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>When {user.name} shares posts, they will appear here</Text>
            </View>
          )
        )}
        
        {activeTab === 'portfolio' && (
          <View style={styles.portfolioContainer}>
            <Text style={styles.emptyText}>Portfolio coming soon</Text>
            <Text style={styles.emptySubtext}>Portfolio showcase will be available in a future update</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        userId={id || ''}
        currentUserId={currentUserId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  role: {
    fontSize: 16,
    color: colors.verified,
    marginBottom: 12,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 14,
    color: colors.gray[500],
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  followingButton: {
    backgroundColor: colors.gray[200],
  },
  followButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  followingButtonText: {
    color: colors.text,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.gray[500],
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  postsContainer: {
    padding: 8,
  },
  postRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  postGridItem: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },
  postGridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: colors.text,
    fontSize: 12,
    marginLeft: 2,
  },
  portfolioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    justifyContent: 'center',
  },
});