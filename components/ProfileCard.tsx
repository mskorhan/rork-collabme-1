import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import StarRating from '@/components/StarRating';
import { UserProfile } from '@/types';
import { colors } from '@/constants/colors';
import { MapPin, BadgeCheck } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

interface ProfileCardProps {
  profile: UserProfile;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large' | 'grid' | 'list';
  showTierBasedRoles?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onPress,
  size = 'medium',
  showTierBasedRoles = false,
}) => {
  const { subscriptionTier } = useAuthStore();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/profile/${profile.id}`);
    }
  };

  const getImageSize = () => {
    switch (size) {
      case 'small':
        return 60;
      case 'medium':
        return 100;
      case 'large':
        return 140;
      case 'grid':
        return 140;
      case 'list':
        return 60;
      default:
        return 100;
    }
  };

  const imageSize = getImageSize();
  
  // Use profile image from user data or fallback
  const profileImage = profile.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
  
  // Determine if this is a creative or company profile
  const isCreative = 'role' in profile;
  
  // Get roles to display based on tier
  const getRolesToDisplay = () => {
    if (!showTierBasedRoles) {
      if (isCreative) {
        return [(profile as any).role?.charAt(0).toUpperCase() + (profile as any).role?.slice(1) || 'Creative'];
      } else {
        return [(profile as any).companyType?.split('_').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Company'];
      }
    }

    // For tier-based role display, we'll simulate multiple roles
    // In a real app, users would have multiple roles/skills
    const baseRole = isCreative 
      ? (profile as any).role?.charAt(0).toUpperCase() + (profile as any).role?.slice(1) || 'Creative'
      : (profile as any).companyType?.split('_').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Company';

    // Simulate additional roles based on tier
    const additionalRoles = isCreative 
      ? ['Photographer', 'Director', 'Producer', 'Writer']
      : ['Agency', 'Studio', 'Production'];

    let rolesToShow = [baseRole];
    
    switch (subscriptionTier) {
      case 'free':
        rolesToShow = [baseRole];
        break;
      case 'gold':
        rolesToShow = [baseRole, additionalRoles[0]];
        break;
      case 'diamond':
        rolesToShow = [baseRole, additionalRoles[0], additionalRoles[1]];
        break;
      default:
        rolesToShow = [baseRole];
    }

    return rolesToShow;
  };

  const rolesToDisplay = getRolesToDisplay();

  if (size === 'list') {
    return (
      <TouchableOpacity 
        style={styles.listContainer} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: profileImage }} 
          style={[styles.listImage, { width: imageSize, height: imageSize }]} 
        />
        
        <View style={styles.listInfoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.listName} numberOfLines={1}>
              {profile.name}
            </Text>
            {profile.isVerified && (
              <BadgeCheck 
                size={16} 
                color={colors.verified} 
                fill="none"
                style={styles.verificationBadge}
              />
            )}
          </View>
          
          <Text style={styles.listRole} numberOfLines={1}>
            {rolesToDisplay.join(' | ')}
          </Text>
          
          {profile.location && (
            <View style={styles.locationContainer}>
              <MapPin size={12} color={colors.gray[500]} />
              <Text style={styles.location} numberOfLines={1}>
                {profile.location}
              </Text>
            </View>
          )}
          
          {profile.rating && (
            <StarRating rating={profile.rating} size={14} style={styles.rating} />
          )}
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, size === 'grid' && styles.gridContainer]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: profileImage }} 
          style={[
            styles.image, 
            { width: imageSize, height: imageSize },
            size === 'grid' && styles.gridImage
          ]} 
        />
      </View>
      
      <View style={[styles.infoContainer, size === 'grid' && styles.gridInfoContainer]}>
        <View style={styles.nameContainer}>
          <Text 
            style={[styles.name, size === 'grid' && styles.gridName]} 
            numberOfLines={1}
          >
            {profile.name}
          </Text>
          {profile.isVerified && (
            <BadgeCheck 
              size={size === 'grid' ? 16 : 18} 
              color={colors.verified} 
              fill="none"
              style={styles.verificationBadge}
            />
          )}
        </View>
        
        <Text style={[styles.role, size === 'grid' && styles.gridRole]} numberOfLines={1}>
          {rolesToDisplay.join(' | ')}
        </Text>
        
        {profile.location && size !== 'grid' && (
          <View style={styles.locationContainer}>
            <MapPin size={12} color={colors.gray[500]} />
            <Text style={styles.location} numberOfLines={1}>
              {profile.location}
            </Text>
          </View>
        )}
        
        {profile.rating && (
          <StarRating rating={profile.rating} size={size === 'grid' ? 12 : 14} style={styles.rating} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  gridContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    borderRadius: 8,
  },
  gridImage: {
    borderRadius: 70,
  },
  listImage: {
    borderRadius: 30,
    marginRight: 12,
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  gridInfoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  listInfoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  gridName: {
    fontSize: 15,
    fontWeight: '600',
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  verificationBadge: {
    marginLeft: 4,
  },
  role: {
    fontSize: 14,
    color: colors.verified,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  gridRole: {
    fontSize: 13,
    marginBottom: 2,
  },
  listRole: {
    fontSize: 14,
    color: colors.verified,
    marginBottom: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 4,
  },
  rating: {
    marginTop: 6,
  },
});

export default ProfileCard;