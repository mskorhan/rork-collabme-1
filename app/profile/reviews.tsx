import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockReviews } from '@/mocks/reviews';
import { mockUsers } from '@/mocks/users';
import { Review } from '@/types';

export default function ReviewsScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  
  // Get user reviews
  const userReviews = mockReviews.filter(review => review.toUserId === userId);
  
  // Calculate average rating
  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
    : 0;

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
            <View style={styles.reviewRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  color={colors.primary}
                  fill={star <= item.rating ? colors.primary : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{item.rating}.0</Text>
            </View>
          </View>
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        {item.projectTitle && (
          <Text style={styles.projectTitle}>Project: {item.projectTitle}</Text>
        )}
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                color={colors.primary}
                fill={star <= Math.round(averageRating) ? colors.primary : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>
            {userReviews.length} review{userReviews.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Reviews List */}
        {userReviews.length > 0 ? (
          <FlatList
            data={userReviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewItem}
            scrollEnabled={false}
            contentContainerStyle={styles.reviewsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <User size={48} color={colors.gray[400]} />
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>
              Reviews from collaborators will appear here
            </Text>
          </View>
        )}
      </ScrollView>
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
  summaryContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 16,
    color: colors.gray[500],
  },
  reviewsList: {
    padding: 16,
  },
  reviewItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
  projectTitle: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});