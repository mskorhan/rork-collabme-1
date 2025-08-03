import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isOnboarded = useAuthStore(state => state.isOnboarded);
  
  // Determine where to redirect based on auth state
  if (isAuthenticated) {
    if (isOnboarded) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/onboarding" />;
    }
  } else {
    return <Redirect href="/auth/login" />;
  }
  
  // Show loading indicator while checking auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});