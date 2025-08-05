import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

interface BackButtonProps {
  onPress?: () => void;
  fallbackUrl?: '/' | '/search' | '/collab' | '/jobs' | '/activity' | '/profile' | '/messages';
  color?: string;
  size?: number;
  style?: any;
}

export default function BackButton({ 
  onPress, 
  fallbackUrl = '/',
  color = colors.text, 
  size = 24, 
  style 
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Always use fallback URL to ensure proper navigation
      // This prevents going back to login or other unintended screens
      router.push(fallbackUrl);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ArrowLeft size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
});