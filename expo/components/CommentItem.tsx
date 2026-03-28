import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThumbsUp, MessageCircle } from 'lucide-react-native';
import { Comment, UserProfile } from '@/types';
import { colors } from '@/constants/colors';

interface CommentItemProps {
  comment: Comment;
  user: UserProfile | undefined;
  currentUserId: string;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onAddReply?: (parentId: string, text: string) => void;
  showReplies?: boolean;
  getUserById: (userId: string) => UserProfile | undefined;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  user,
  currentUserId,
  onLike,
  onReply,
  onAddReply,
  showReplies = true,
  getUserById,
}) => {
  const isLiked = comment.likes.includes(currentUserId);
  
  const formatDate = (timestamp: number) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return commentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.username}>{user?.name || 'User'}</Text>
          <Text style={styles.time}>{formatDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.action} 
            onPress={() => onLike(comment.id)}
            activeOpacity={0.7}
          >
            <ThumbsUp 
              size={16} 
              color={isLiked ? colors.primary : colors.gray[500]} 
              fill={isLiked ? colors.primary : 'none'} 
            />
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {comment.likes.length > 0 ? comment.likes.length : ''} Like
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.action} 
            onPress={() => onReply(comment.id)}
            activeOpacity={0.7}
          >
            <MessageCircle size={16} color={colors.gray[500]} />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
        
        {/* Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                user={getUserById(reply.userId)}
                currentUserId={currentUserId}
                onLike={onLike}
                onReply={onReply}
                onAddReply={onAddReply}
                showReplies={false} // Prevent infinite nesting
                getUserById={getUserById}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
    maxWidth: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.gray[500],
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 4,
  },
  actionTextActive: {
    color: colors.primary,
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray[300],
    marginBottom: 8,
  },
});

export default CommentItem;