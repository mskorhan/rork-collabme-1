import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Animated, PanResponder, Dimensions, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { X, Check } from 'lucide-react-native';
import CollabCard from '@/components/CollabCard';
import Button from '@/components/Button';
import { mockCreatives } from '@/mocks/users';
import { Platform } from 'react-native';
import { CreativeProfile } from '@/types';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function CollabScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [collabedUsers, setCollabedUsers] = useState<string[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<string[]>([]);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabMessage, setCollabMessage] = useState('');
  const [pendingCollabUserId, setPendingCollabUserId] = useState<string | null>(null);

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleSwipeRight = () => {
    if (currentIndex < mockCreatives.length) {
      setPendingCollabUserId(mockCreatives[currentIndex].id);
      setShowCollabModal(true);
    }
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      if (currentIndex < mockCreatives.length) {
        setCollabedUsers([...collabedUsers, mockCreatives[currentIndex].id]);
      }
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      if (currentIndex < mockCreatives.length) {
        setRejectedUsers([...rejectedUsers, mockCreatives[currentIndex].id]);
      }
      nextCard();
    });
  };

  const nextCard = () => {
    setCurrentIndex(nextIndex);
    setNextIndex(nextIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const handleAccept = () => {
    if (currentIndex < mockCreatives.length) {
      setPendingCollabUserId(mockCreatives[currentIndex].id);
      setShowCollabModal(true);
    }
  };

  const handleReject = () => {
    swipeLeft();
  };

  const handleProfilePress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleFollow = (userId: string) => {
    // Here you would typically send a follow request to your backend
    console.log('Following user:', userId);
    // You could also update local state to show the user is being followed
  };

  const handleCollabSubmit = () => {
    if (collabMessage.trim().length === 0) {
      Alert.alert('Message Required', 'Please explain why you want to collaborate.');
      return;
    }

    if (collabMessage.trim().length > 200) {
      Alert.alert('Message Too Long', 'Please keep your message under 200 characters.');
      return;
    }

    // Here you would typically send the collaboration request to your backend
    console.log('Collaboration request sent:', {
      userId: pendingCollabUserId,
      message: collabMessage.trim(),
    });

    // Close modal and proceed with swipe
    setShowCollabModal(false);
    setCollabMessage('');
    setPendingCollabUserId(null);
    swipeRight();
  };

  const handleCollabCancel = () => {
    setShowCollabModal(false);
    setCollabMessage('');
    setPendingCollabUserId(null);
    resetPosition();
  };

  const renderCards = () => {
    if (currentIndex >= mockCreatives.length) {
      return (
        <View style={styles.endContainer}>
          <Text style={styles.endTitle}>No more profiles</Text>
          <Text style={styles.endText}>Check back later for new creatives to collaborate with</Text>
        </View>
      );
    }

    const cardStyle = {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate: rotation },
      ],
    };

    return (
      <View style={styles.cardsContainer}>
        {nextIndex < mockCreatives.length && (
          <View style={[styles.cardContainer, styles.nextCardContainer]}>
            <CollabCard
              profile={mockCreatives[nextIndex] as CreativeProfile}
              onAccept={() => {}}
              onReject={() => {}}
              onProfilePress={() => {}}
              onFollow={() => {}}
            />
          </View>
        )}
        
        <Animated.View
          style={[styles.cardContainer, cardStyle]}
          {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        >
          <CollabCard
            profile={mockCreatives[currentIndex] as CreativeProfile}
            onAccept={handleAccept}
            onReject={handleReject}
            onProfilePress={() => handleProfilePress(mockCreatives[currentIndex].id)}
            onFollow={() => handleFollow(mockCreatives[currentIndex].id)}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Collaborate',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.white,
          },
        }}
      />
      
      {renderCards()}

      {/* Collaboration Request Modal */}
      <Modal
        visible={showCollabModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCollabCancel}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.modalScrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Collaboration Request</Text>
                <TouchableOpacity onPress={handleCollabCancel} style={styles.closeButton}>
                  <X size={24} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalSubtitle}>
                Explain why you want to collaborate with {pendingCollabUserId ? mockCreatives.find(u => u.id === pendingCollabUserId)?.name : 'this user'}
              </Text>
              
              <TextInput
                style={styles.messageInput}
                placeholder="I would love to collaborate because..."
                placeholderTextColor={colors.gray[400]}
                value={collabMessage}
                onChangeText={setCollabMessage}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              
              <View style={styles.characterCount}>
                <Text style={[
                  styles.characterCountText,
                  collabMessage.length > 200 && styles.characterCountError
                ]}>
                  {collabMessage.length}/200
                </Text>
              </View>
              
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={handleCollabCancel}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="Send Request"
                  onPress={handleCollabSubmit}
                  style={styles.modalButton}
                  disabled={collabMessage.trim().length === 0}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nextCardContainer: {
    top: 20,
    transform: [{ scale: 0.92 }],
    opacity: 0.6,
  },
  endContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  endTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  endText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalScrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 16,
    lineHeight: 22,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    height: 120,
    marginBottom: 8,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  characterCountText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  characterCountError: {
    color: colors.error,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});