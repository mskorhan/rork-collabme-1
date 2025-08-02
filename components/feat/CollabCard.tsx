import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '@/types';
import { theme } from '@/constants/theme';
import { MapPin, X, User, Circle, UserPlus, Star, Handshake, CheckCircle } from 'lucide-react-native';

interface CollabCardProps {
  profile: UserProfile;
  onAccept: () => void;
  onReject: () => void;
  onProfilePress: () => void;
  onFollow?: () => void;
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
}) => {
  // Use a placeholder image if no profile image is available
  const profileImage = profile.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Determine if this is a creative or company profile
  const isCreative = 'role' in profile;
  
  // Get online status color
  const getOnlineStatusColor = () => {
    switch (profile.onlineStatus) {
      case 'online':
        return theme.colors.success600;
      case 'away':
        return theme.colors.warning600;
      case 'offline':
      default:
        return theme.colors.neutral400;
    }
  };

  // Get work status color and text
  const getWorkStatusInfo = () => {
    switch (profile.workStatus) {
      case 'available':
        return { color: theme.colors.success600, text: 'Available for work' };
      case 'busy':
        return { color: theme.colors.warning600, text: 'Currently busy' };
      case 'not_available':
        return { color: theme.colors.error600, text: 'Not available' };
      default:
        return { color: theme.colors.neutral400, text: 'Status unknown' };
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
                    <CheckCircle size={14} color={theme.colors.white} />
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
                  <MapPin size={12} color={theme.colors.neutral600} />
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
                style={[styles.overlayButton, styles.rejectButton]} 
                onPress={onReject}
              >
                <X size={24} color={theme.colors.white} />
              </TouchableOpacity>
              
              {/* Follow Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.followButton]} 
                onPress={onFollow || (() => console.log('Follow pressed'))}
              >
                <UserPlus size={24} color={theme.colors.white} />
              </TouchableOpacity>
              
              {/* Accept Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.acceptButton]} 
                onPress={onAccept}
              >
                <Handshake size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Button - Bottom Right */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onProfilePress}
          >
            <User size={20} color={theme.colors.white} />
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
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
    backgroundColor: theme.colors.neutral200,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 10,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  onlineStatusText: {
    fontSize: theme.fontSize.xs + 1,
    fontWeight: '600' as const,
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
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
    padding: theme.spacing.lg - theme.spacing.sm,
    paddingBottom: 120,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold' as const,
    color: theme.colors.white,
    marginRight: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.primary500,
    borderRadius: theme.spacing.sm + 2,
    padding: 2,
  },
  role: {
    fontSize: theme.fontSize.md,
    color: theme.colors.neutral100,
    marginBottom: theme.spacing.sm,
    fontWeight: '500' as const,
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
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    marginLeft: 3,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.neutral100,
    marginLeft: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: theme.spacing.lg - theme.spacing.sm,
    left: theme.spacing.lg - theme.spacing.sm,
    right: theme.spacing.lg - theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg - theme.spacing.sm,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  rejectButton: {
    backgroundColor: theme.colors.error600,
  },
  acceptButton: {
    backgroundColor: theme.colors.success600,
  },
  followButton: {
    backgroundColor: theme.colors.primary500,
  },
  profileButton: {
    position: 'absolute',
    bottom: 130,
    right: theme.spacing.lg - theme.spacing.sm,
    backgroundColor: theme.colors.primary500,
    borderRadius: 24,
    padding: theme.spacing.sm + theme.spacing.xs,
    ...theme.shadows.sm,
    zIndex: 10,
  },
});

export default CollabCard;