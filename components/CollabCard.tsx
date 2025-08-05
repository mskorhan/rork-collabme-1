import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { MapPin, X, User, Circle, UserPlus, Star, Handshake, CheckCircle } from 'lucide-react-native';
import { Platform } from 'react-native';

interface CollabCardProps {
  profile: UserProfile;
  onAccept: () => void;
  onReject: () => void;
  onProfilePress: () => void;
  onFollow?: () => void;
  isProcessing?: boolean;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9, 380);
const CARD_HEIGHT = Math.min(height * 0.75, 600);

export const CollabCard: React.FC<CollabCardProps> = ({
  profile,
  onAccept,
  onReject,
  onProfilePress,
  onFollow,
  isProcessing = false,
}) => {
  // Use a placeholder image if no profile image is available
  const profileImage = profile.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Determine if this is a creative or company profile
  const isCreative = 'role' in profile;
  
  // Get online status color
  const getOnlineStatusColor = () => {
    switch (profile.onlineStatus) {
      case 'online':
        return colors.success;
      case 'away':
        return '#FFA500'; // Orange
      case 'offline':
      default:
        return colors.gray[400];
    }
  };

  // Get work status color and text
  const getWorkStatusInfo = () => {
    switch (profile.workStatus) {
      case 'available':
        return { color: colors.success, text: 'Available for work' };
      case 'busy':
        return { color: '#FFA500', text: 'Currently busy' };
      case 'not_available':
        return { color: colors.error, text: 'Not available' };
      default:
        return { color: colors.gray[400], text: 'Status unknown' };
    }
  };

  const workStatusInfo = getWorkStatusInfo();
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Main Image Container */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: profileImage }} 
            style={styles.image} 
            resizeMode="cover" 
          />
          
          {/* Top Row - Online Status */}
          <View style={styles.topRow}>
            <View style={styles.onlineStatusContainer}>
              <Circle 
                size={8} 
                color={getOnlineStatusColor()} 
                fill={getOnlineStatusColor()}
              />
              <Text style={styles.onlineStatusText}>
                {profile.onlineStatus === 'online' ? 'Online' : 
                 profile.onlineStatus === 'away' ? 'Away' : 'Offline'}
              </Text>
            </View>
          </View>

          {/* Profile Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
            style={styles.infoOverlay}
          >
            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>{profile.name}</Text>
                {profile.verified && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle size={14} color={colors.white} />
                  </View>
                )}
              </View>
              
              <Text style={styles.role} numberOfLines={1}>
                {isCreative ? 
                  (profile as any).role.split('_').map((word: string) => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ') :
                  (profile as any).companyType.split('_').map((word: string) => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')
                }
              </Text>
              
              {/* Rating */}
              {profile.rating && (
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{profile.rating.toFixed(1)}</Text>
                </View>
              )}
              
              {profile.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={12} color={colors.gray[600]} />
                  <Text style={styles.location}>{profile.location}</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Action Buttons Overlay */}
          <View style={styles.buttonOverlay}>
            <View style={styles.buttonContainer}>
              {/* Reject Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.rejectButton, isProcessing && styles.disabledButton]} 
                onPress={isProcessing ? undefined : onReject}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                <X size={24} color={colors.white} />
              </TouchableOpacity>
              
              {/* Follow Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.followButton, isProcessing && styles.disabledButton]} 
                onPress={isProcessing ? undefined : (onFollow || (() => console.log('Follow pressed')))}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                <UserPlus size={24} color={colors.white} />
              </TouchableOpacity>
              
              {/* Accept Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.acceptButton, isProcessing && styles.disabledButton]} 
                onPress={isProcessing ? undefined : onAccept}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                <Handshake size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Button - Bottom Right */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onProfilePress}
          >
            <User size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginHorizontal: (width - CARD_WIDTH) / 2,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
    backgroundColor: colors.gray[200],
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 10,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  onlineStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 2,
  },
  role: {
    fontSize: 16,
    color: colors.gray[100],
    marginBottom: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 3,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: colors.gray[100],
    marginLeft: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  followButton: {
    backgroundColor: colors.primary,
  },
  profileButton: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CollabCard;