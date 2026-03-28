import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Keyboard,
  ScrollView
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Comment, Post, UserProfile } from '@/types';
import CommentItem from './CommentItem';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post | null;
  currentUserId: string;
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  onReplyComment: (commentId: string) => void;
  onAddReply: (parentCommentId: string, text: string) => void;
  getUserById: (userId: string) => UserProfile | undefined;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  post,
  currentUserId,
  onAddComment,
  onLikeComment,
  onReplyComment,
  onAddReply,
  getUserById
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    
    if (replyingTo) {
      onAddReply(replyingTo, commentText);
    } else {
      onAddComment(commentText);
    }
    
    setCommentText('');
    setReplyingTo(null);
    Keyboard.dismiss();
  };

  const handleReply = (commentId: string) => {
    // Find the comment in the post's comments or nested replies
    const findComment = (comments: any[], id: string): any => {
      for (const comment of comments) {
        if (comment.id === id) return comment;
        if (comment.replies && comment.replies.length > 0) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const comment = findComment(post?.comments || [], commentId);
    if (!comment) return;
    
    const user = getUserById(comment.userId);
    if (!user) return;
    
    setReplyingTo(commentId);
    setCommentText(`@${user.username} `);
    inputRef.current?.focus();
    
    onReplyComment(commentId);
  };
  
  const handleAddReply = (parentId: string, text: string) => {
    if (!text.trim()) return;
    
    // Call the parent's onAddReply function
    onAddReply(parentId, text);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {replyingTo ? 'Reply to Comment' : 'Comments'}
            </Text>
            <TouchableOpacity onPress={() => {
              if (replyingTo) {
                setReplyingTo(null);
                setCommentText('');
              } else {
                onClose();
              }
            }} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            style={styles.commentsList}
            data={post?.comments || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem
                comment={item}
                user={getUserById(item.userId)}
                currentUserId={currentUserId}
                onLike={onLikeComment}
                onReply={handleReply}
                onAddReply={onAddReply}
                getUserById={getUserById}
              />
            )}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
              </View>
            }
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
          
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              {replyingTo && (
                <View style={styles.replyingBadge}>
                  <Text style={styles.replyingText}>Replying</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setReplyingTo(null);
                      setCommentText('');
                    }}
                    style={styles.cancelReplyButton}
                  >
                    <X size={12} color={colors.white} />
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                ref={inputRef}
                style={[styles.input, replyingTo && styles.inputWithBadge]}
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
            </View>
            <TouchableOpacity 
              style={[styles.submitButton, !commentText.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!commentText.trim()}
            >
              <Send size={20} color={commentText.trim() ? colors.white : colors.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    maxHeight: Dimensions.get('window').height * 0.8,
    height: Dimensions.get('window').height * 0.8,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    padding: 16,
    flex: 1,
    marginBottom: 80, // Add more space at the bottom to prevent comments from being hidden behind input
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  inputWithBadge: {
    paddingTop: 24,
  },
  replyingBadge: {
    position: 'absolute',
    top: 4,
    left: 16,
    zIndex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyingText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    marginRight: 4,
  },
  cancelReplyButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
});

export default CommentsModal;