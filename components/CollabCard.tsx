import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { MapPin, X, Circle, UserPlus, Star, Handshake, CheckCircle, BadgeCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFollowStore } from '@/store/followStore';

interface CollabCardProps {
  profile: UserProfile;
  onAccept: () => void;
  onReject: () => void;
  onProfilePress: () => void;
  onFollow?: () => void;
  isProcessing?: boolean;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.95, 420);
const CARD_HEIGHT = Math.min(height * 0.8, 680);

export const CollabCard: React.FC<CollabCardProps> = ({
  profile,
  onAccept,
  onReject,
  onProfilePress,
  onFollow,
  isProcessing = false,
}) => {
  const { followUser, unfollowUser, isFollowing } = useFollowStore();
  const isUserFollowing = isFollowing(profile.id);
  
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
  
  const handleFollowPress = () => {
    if (isUserFollowing) {
      unfollowUser(profile.id);
    } else {
      followUser(profile.id);
    }
    onFollow?.();
  };


  
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
          
          {/* Top Row - Online Status and Location */}
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
              {profile.location && (
                <>
                  <Text style={styles.locationSeparator}>•</Text>
                  <MapPin size={10} color={colors.white} style={styles.locationIcon} />
                  <Text style={styles.topLocationText}>{profile.location}</Text>
                </>
              )}
            </View>
          </View>

          {/* Profile Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
            style={styles.infoOverlay}
          >
            <View style={styles.infoContainer}>
              {/* Left column: name -> creative type -> stars */}
              <View style={styles.leftInfoColumn}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{profile.name}</Text>
                  {profile.verified && (
                    <BadgeCheck size={18} color="#1DA1F2" style={styles.verifiedIcon} />
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
                {profile.rating && (
                  <TouchableOpacity 
                    style={styles.ratingContainer}
                    onPress={() => router.push(`/profile/reviews?userId=${profile.id}`)}
                    activeOpacity={0.7}
                    accessibilityLabel="open-reviews"
                    testID="rating-button"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        color="#FFD700"
                        fill={star <= Math.round(profile.rating!) ? "#FFD700" : "transparent"}
                        style={styles.starIcon}
                      />
                    ))}
                    <Text style={styles.ratingText}>{profile.rating.toFixed(1)}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Right: profile button */}
              <TouchableOpacity 
                style={styles.profileButtonRight}
                onPress={onProfilePress}
                activeOpacity={0.8}
                accessibilityLabel="open-profile"
                testID="profile-button"
              >
                <Text style={styles.profileButtonText}>PROFILE</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Action Buttons Overlay - Moved Much Lower */}
          <View style={styles.buttonOverlay}>
            <View style={styles.buttonContainer}>
              {/* Reject Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.rejectButton, isProcessing && styles.disabledButton]} 
                onPress={isProcessing ? undefined : onReject}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                <X size={28} color={colors.white} />
              </TouchableOpacity>
              
              {/* Follow Button */}
              <TouchableOpacity 
                style={[
                  styles.overlayButton, 
                  isUserFollowing ? styles.followingButton : styles.followButton, 
                  isProcessing && styles.disabledButton
                ]} 
                onPress={isProcessing ? undefined : handleFollowPress}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                {isUserFollowing ? (
                  <CheckCircle size={28} color={colors.white} />
                ) : (
                  <UserPlus size={28} color={colors.white} />
                )}
              </TouchableOpacity>
              
              {/* Accept Button */}
              <TouchableOpacity 
                style={[styles.overlayButton, styles.acceptButton, isProcessing && styles.disabledButton]} 
                onPress={isProcessing ? undefined : onAccept}
                activeOpacity={isProcessing ? 1 : 0.8}
                disabled={isProcessing}
              >
                <Handshake size={28} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>


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
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
    backgroundColor: colors.gray[200],
    borderRadius: 24,
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
  locationSeparator: {
    fontSize: 10,
    color: colors.white,
    marginHorizontal: 6,
    fontWeight: '600',
  },
  locationIcon: {
    marginRight: 2,
  },
  topLocationText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
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
    padding: 24,
    paddingBottom: 140,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameAndRatingRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  leftInfoColumn: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    maxWidth: '40%',
  },
  verifiedIcon: {
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  role: {
    fontSize: 14,
    color: colors.gray[100],
    marginBottom: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  starIcon: {
    marginRight: 0.5,
  },
  ratingText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
    fontWeight: '700',
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
    left: 24,
    right: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  overlayButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
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
  followingButton: {
    backgroundColor: colors.success,
  },
  profileButtonRight: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'flex-start',
  },
  profileButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CollabCard;