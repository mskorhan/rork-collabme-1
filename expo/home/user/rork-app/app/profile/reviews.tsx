import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { mockReviews } from '@/mocks/reviews';
import { mockCollabHistory } from '@/mocks/collabHistory';
import { mockUsers } from '@/mocks/users';
import { Review, CollabHistory } from '@/types';
import StarRating from '@/components/StarRating';
import { ArrowLeft, Star, Briefcase } from 'lucide-react-native';

type TabType = 'reviews' | 'collabs';

export default function ReviewsScreen() {
  const { userId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  
  // Filter reviews and collabs for the specific user
  const userReviews = mockReviews.filter((review: Review) => review.toUserId === userId);
  const userCollabs = mockCollabHistory.filter((collab: CollabHistory) => 
    collab.participants.includes(userId as string)
  );

  const formatTime = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    const reviewer = mockUsers.find(user => user.id === item.fromUserId);
    if (!reviewer) return null;

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Image 
            source={{ uri: reviewer.profileImage || reviewer.avatar }} 
            style={styles.reviewerAvatar} 
          />
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>{reviewer.name}</Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={item.rating} size={14} />
              <Text style={styles.ratingText}>{item.rating}.0</Text>
            </View>
          </View>
          <Text style={styles.reviewTime}>{formatTime(item.createdAt)}</Text>
        </View>
        
        {item.projectTitle && (
          <Text style={styles.projectTitle}>{item.projectTitle}</Text>
        )}
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
      </View>
    );
  };

  const renderCollabItem = ({ item }: { item: CollabHistory }) => {
    const collaborator = mockUsers.find(user => 
      item.participants.find(id => id !== userId) === user.id
    );
    if (!collaborator) return null;

    return (
      <View style={styles.collabItem}>
        <View style={styles.collabHeader}>
          <Image 
            source={{ uri: collaborator.profileImage || collaborator.avatar }} 
            style={styles.collaboratorAvatar} 
          />
          <View style={styles.collabInfo}>
            <Text style={styles.collabTitle}>{item.title}</Text>
            <Text style={styles.collaboratorName}>with {collaborator.name}</Text>
            <View style={styles.collabMeta}>
              <View style={[
                styles.statusBadge, 
                item.status === 'completed' && styles.completedBadge,
                item.status === 'ongoing' && styles.ongoingBadge,
                item.status === 'cancelled' && styles.cancelledBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'completed' && styles.completedText,
                  item.status === 'ongoing' && styles.ongoingText,
                  item.status === 'cancelled' && styles.cancelledText
                ]}>{item.status}</Text>
              </View>
              {item.rating && (
                <View style={styles.collabRating}>
                  <StarRating rating={item.rating} size={12} />
                  <Text style={styles.collabRatingText}>{item.rating}.0</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.collabTime}>
            {item.completedAt ? formatTime(item.completedAt) : formatTime(item.createdAt)}
          </Text>
        </View>
        
        {item.review && (
          <Text style={styles.collabReview}>{item.review}</Text>
        )}
      </View>
    );
  };

  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / userReviews.length 
    : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Reviews & Collabs',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Summary Header */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Star size={20} color={colors.primary} fill={colors.primary} />
          </View>
          <Text style={styles.summaryValue}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>Average Rating</Text>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Briefcase size={20} color={colors.secondary} />
          </View>
          <Text style={styles.summaryValue}>{userCollabs.length}</Text>
          <Text style={styles.summaryLabel}>Total Collabs</Text>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Star size={16} color={activeTab === 'reviews' ? colors.primary : colors.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Reviews ({userReviews.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'collabs' && styles.activeTab]}
          onPress={() => setActiveTab('collabs')}
        >
          <Briefcase size={16} color={activeTab === 'collabs' ? colors.primary : colors.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'collabs' && styles.activeTabText]}>
            Collabs ({userCollabs.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'reviews' ? (
        <FlatList<Review>
          data={userReviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No reviews yet
              </Text>
              <Text style={styles.emptySubtext}>
                Reviews from completed collaborations will appear here
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList<CollabHistory>
          data={userCollabs}
          keyExtractor={(item) => item.id}
          renderItem={renderCollabItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No collabs yet
              </Text>
              <Text style={styles.emptySubtext}>
                Collaboration history will appear here
              </Text>
            </View>
          }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  reviewItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
  },
  reviewTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  collabItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  collabHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  collaboratorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  collabInfo: {
    flex: 1,
  },
  collabTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  collaboratorName: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  collabMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
  },
  completedBadge: {
    backgroundColor: colors.primary + '15',
  },
  ongoingBadge: {
    backgroundColor: colors.secondary + '15',
  },
  cancelledBadge: {
    backgroundColor: colors.error + '15',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  completedText: {
    color: colors.primary,
  },
  ongoingText: {
    color: colors.secondary,
  },
  cancelledText: {
    color: colors.error,
  },
  collabRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  collabRatingText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  collabTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  collabReview: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
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
    lineHeight: 20,
  },
});