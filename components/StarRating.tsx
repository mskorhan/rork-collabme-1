import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  style?: any;
  textStyle?: any;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  showValue = true,
  style,
  textStyle,
}) => {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {/* Full stars */}
        {Array(fullStars).fill(0).map((_, i) => (
          <Star 
            key={`full-${i}`} 
            size={size} 
            color={colors.primary} 
            fill={colors.primary} 
          />
        ))}
        
        {/* Partial star */}
        {partialStar > 0 && (
          <View style={[styles.partialStarContainer, { width: size, height: size }]}>
            <Star 
              size={size} 
              color={colors.gray[300]} 
              style={styles.basePartialStar} 
            />
            <View style={[styles.partialStarOverlay, { width: `${partialStar * 100}%` }]}>
              <Star 
                size={size} 
                color={colors.primary} 
                fill={colors.primary} 
              />
            </View>
          </View>
        )}
        
        {/* Empty stars */}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            size={size} 
            color={colors.gray[300]} 
          />
        ))}
      </View>
      
      {/* Rating value */}
      {showValue && (
        <Text style={[styles.ratingText, textStyle]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partialStarContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  basePartialStar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  partialStarOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default StarRating;