import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { X, Star, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockReviews } from '@/mocks/reviews';
import { mockCollabHistory } from '@/mocks/collabHistory';
import { mockUsers } from '@/mocks/users';
import { Review, CollabHistory, UserProfile } from '@/types';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  currentUserId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  userId,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user reviews
  const userReviews = mockReviews.filter(review => review.toUserId === userId);
  
  // Get collaboration history between current user and target user
  const collabHistory = mockCollabHistory.filter(collab => 
    collab.participants.includes(currentUserId) && 
    collab.participants.includes(userId) &&
    collab.status === 'completed'
  );

  // Check if users have collaborated
  const hasCollaborated = collabHistory.length > 0;

  // Check if current user has already reviewed this user
  const existingReview = mockReviews.find(review => 
    review.fromUserId === currentUserId && review.toUserId === userId
  );

  const canWriteReview = hasCollaborated && !existingReview;

  useEffect(() => {
    if (visible) {
      setActiveTab(canWriteReview ? 'reviews' : 'reviews');
      setRating(0);
      setComment('');
      setSelectedProject('');
    }
  }, [visible, canWriteReview]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Error', 'Please write a review with at least 10 characters');
      return;
    }

    if (!selectedProject) {
      Alert.alert('Error', 'Please select a project');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Review submitted successfully!', [
        { text: 'OK', onPress: onClose }
      ]);
      
      // Reset form
      setRating(0);
      setComment('');
      setSelectedProject('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (interactive: boolean = false) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={interactive ? () => setRating(star) : undefined}
            disabled={!interactive}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={colors.primary}
              fill={star <= rating ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    const reviewer = mockUsers.find(user => user.id === item.fromUserId);
    if (!reviewer) return null;

    const reviewerImage = reviewer.profileImage || reviewer.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Image 
            source={{ uri: reviewerImage }} 
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

  const renderCollabOption = (collab: CollabHistory) => (
    <TouchableOpacity
      key={collab.id}
      style={[
        styles.projectOption,
        selectedProject === collab.id && styles.selectedProjectOption
      ]}
      onPress={() => setSelectedProject(collab.id)}
    >
      <Text style={[
        styles.projectOptionText,
        selectedProject === collab.id && styles.selectedProjectOptionText
      ]}>
        {collab.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews ({userReviews.length})
            </Text>
          </TouchableOpacity>
          
          {canWriteReview && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'write' && styles.activeTab]}
              onPress={() => setActiveTab('write')}
            >
              <Text style={[styles.tabText, activeTab === 'write' && styles.activeTabText]}>
                Write Review
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'reviews' ? (
            userReviews.length > 0 ? (
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
            )
          ) : (
            <View style={styles.writeReviewContainer}>
              {!hasCollaborated ? (
                <View style={styles.noCollabContainer}>
                  <Text style={styles.noCollabText}>
                    You need to collaborate with this user before you can write a review
                  </Text>
                  <Text style={styles.noCollabSubtext}>
                    Complete a project together to unlock the ability to leave a review
                  </Text>
                </View>
              ) : existingReview ? (
                <View style={styles.existingReviewContainer}>
                  <Text style={styles.existingReviewText}>
                    You've already reviewed this user
                  </Text>
                  <Text style={styles.existingReviewSubtext}>
                    You can only write one review per collaborator
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Rate your experience</Text>
                  {renderStarRating(true)}
                  
                  <Text style={styles.sectionTitle}>Select project</Text>
                  <View style={styles.projectOptions}>
                    {collabHistory.map(renderCollabOption)}
                  </View>
                  
                  <Text style={styles.sectionTitle}>Write your review</Text>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Share your experience working with this person..."
                    placeholderTextColor={colors.gray[400]}
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                    maxLength={500}
                  />
                  <Text style={styles.characterCount}>
                    {comment.length}/500 characters
                  </Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (rating === 0 || comment.trim().length < 10 || !selectedProject || isSubmitting) && 
                      styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmitReview}
                    disabled={rating === 0 || comment.trim().length < 10 || !selectedProject || isSubmitting}
                  >
                    <Text style={[
                      styles.submitButtonText,
                      (rating === 0 || comment.trim().length < 10 || !selectedProject || isSubmitting) && 
                      styles.submitButtonTextDisabled
                    ]}>
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

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
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
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
  content: {
    flex: 1,
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
  writeReviewContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  projectOptions: {
    marginBottom: 16,
  },
  projectOption: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedProjectOption: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  projectOptionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedProjectOptionText: {
    color: colors.primary,
  },
  commentInput: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  characterCount: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: colors.gray[500],
  },
  noCollabContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noCollabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  noCollabSubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  existingReviewContainer: {
    alignItems: 'center',
    padding: 40,
  },
  existingReviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  existingReviewSubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default ReviewModal;