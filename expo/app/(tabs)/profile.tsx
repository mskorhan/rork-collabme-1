import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, router, useNavigation } from 'expo-router';
import { colors } from '@/constants/colors';
import { MapPin, Grid, User, FileText, Edit, MessageCircle, Settings, Pin } from 'lucide-react-native';
import Button from '@/components/Button';
import StarRating from '@/components/StarRating';
import ReviewModal from '@/components/ReviewModal';
import WallPostInput from '@/components/WallPostInput';
import { getCurrentUser } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { Post } from '@/types';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'about' | 'resume'>('feed');
  const [userPosts, setUserPosts] = useState<Post[]>(mockPosts.filter(post => post.userId === getCurrentUser().id));
  const [pinnedPost, setPinnedPost] = useState<Post | null>(userPosts.length > 0 ? userPosts[0] : null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const user = getCurrentUser();
  const collabsCount = 12; // Mock collabs count - in real app this would come from API
  
  // Filter posts based on active tab
  const filteredPosts = activeTab === 'feed' ? userPosts : [];

  const handleWallPost = (content: { text: string; type: 'text' | 'photo' | 'video' | 'audio' | 'pdf'; media?: string }) => {
    // Create a new post
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
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

    // Add to the beginning of user posts array
    setUserPosts([newPost, ...userPosts]);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettingsPress = () => {
    // Navigate to settings page
    console.log('Navigate to settings');
  };
  
  // Use a placeholder image if no profile image is available
  const profileImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Profile Header with Settings */}
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderContent}>
          <Text style={styles.profileHeaderTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          
          <Text style={styles.name}>{user.name}</Text>
          
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
          
          {'role' in user && (
            <Text style={styles.role}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          )}
          
          {user.location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.gray[500]} />
              <Text style={styles.location}>
                {user.location}
              </Text>
            </View>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>348</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{collabsCount}</Text>
              <Text style={styles.statLabel}>Collabs</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              variant="outline"
              style={styles.editButton}
              textStyle={styles.editButtonText}
            />
          </View>
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
          
          {'skills' in user && user.skills && user.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsList}>
                {user.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Wall Post Input */}
          <View style={styles.wallPostContainer}>
            <WallPostInput 
              onPost={handleWallPost}
              placeholder="Share something with your followers..."
            />
          </View>
          
          {/* Pinned Post */}
          {pinnedPost && (
            <View style={styles.pinnedPostContainer}>
              <View style={styles.pinnedHeader}>
                <Pin size={16} color={colors.primary} />
                <Text style={styles.pinnedText}>Pinned Post</Text>
              </View>
              <View style={styles.pinnedPostContent}>
                <Text style={styles.pinnedPostDescription} numberOfLines={2}>
                  {pinnedPost.description || pinnedPost.title}
                </Text>
                {pinnedPost.type === 'photo' && (
                  <Image source={{ uri: pinnedPost.content }} style={styles.pinnedPostImage} />
                )}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
              onPress={() => setActiveTab('feed')}
            >
              <Grid size={20} color={activeTab === 'feed' ? colors.primary : colors.gray[500]} />
              <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Post Feed</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'about' && styles.activeTab]}
              onPress={() => setActiveTab('about')}
            >
              <User size={20} color={activeTab === 'about' ? colors.primary : colors.gray[500]} />
              <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'resume' && styles.activeTab]}
              onPress={() => setActiveTab('resume')}
            >
              <FileText size={20} color={activeTab === 'resume' ? colors.primary : colors.gray[500]} />
              <Text style={[styles.tabText, activeTab === 'resume' && styles.activeTabText]}>Resume</Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 'feed' && (
            filteredPosts.length > 0 ? (
              <FlatList
                key={`profile-posts-grid-3-cols`}
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.postRow}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.postItem}>
                    <Image source={{ uri: item.content }} style={styles.postImage} />
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
                <Text style={styles.emptyText}>No posts to display</Text>
                <Button
                  title="Add Post"
                  onPress={() => {}}
                  variant="outline"
                  style={styles.addButton}
                />
              </View>
            )
          )}
          
          {activeTab === 'about' && (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.aboutText}>{user.bio}</Text>
              
              {user.location && (
                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Location</Text>
                  <Text style={styles.aboutSectionText}>{user.location}</Text>
                </View>
              )}
              
              {'skills' in user && user.skills && user.skills.length > 0 && (
                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Skills</Text>
                  <View style={styles.skillsList}>
                    {user.skills.map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
          
          {activeTab === 'resume' && (
            <View style={styles.resumeContainer}>
              <Text style={styles.resumeTitle}>Resume</Text>
              <Text style={styles.resumeText}>Resume content will be displayed here.</Text>
              <Button
                title="Upload Resume"
                onPress={() => {}}
                variant="outline"
                style={styles.uploadButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        userId={user.id}
        currentUserId={user.id} // Same user viewing their own profile
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileHeader: {
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
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    justifyContent: 'center',
  },
  role: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: colors.gray[500],
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[500],
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.gray[200],
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  editButton: {
    borderColor: colors.gray[300],
  },
  editButtonText: {
    color: colors.text,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  skillsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  wallPostContainer: {
    width: '100%',
    marginBottom: 16,
  },
  pinnedPostContainer: {
    width: '100%',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pinnedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  pinnedPostContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pinnedPostDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  pinnedPostImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    color: colors.gray[500],
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  postRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    gap: 4,
  },
  postItem: {
    width: '31.5%',
    aspectRatio: 1,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },
  postImage: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 16,
  },
  addButton: {
    minWidth: 120,
  },
  aboutContainer: {
    padding: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  aboutSectionText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  resumeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resumeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  resumeText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    minWidth: 150,
  },
});