import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

interface BackButtonProps {
  onPress?: () => void;
  fallbackUrl?: '/' | '/profile' | '/messages' | '/jobs' | '/collab';
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
      // Check if we can go back in history
      if (Platform.OS === 'web') {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      } else {
        router.back();
      }
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