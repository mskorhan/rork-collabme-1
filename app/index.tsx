import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isOnboarded = useAuthStore(state => state.isOnboarded);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const setOnboarded = useAuthStore(state => state.setOnboarded);
  
  console.log('IndexScreen - Auth state:', { isAuthenticated, isOnboarded });
  
  // For development - auto-authenticate user
  useEffect(() => {
    console.log('IndexScreen useEffect running');
    if (!isAuthenticated) {
      console.log('Auto-authenticating user for development');
      setAuthenticated('1', 'creative', 'free');
      setOnboarded(true);
    }
  }, [isAuthenticated, setAuthenticated, setOnboarded]);
  
  // Add some debug logging
  console.log('IndexScreen render - Auth state:', { isAuthenticated, isOnboarded });
  
  // Determine where to redirect based on auth state
  if (isAuthenticated) {
    if (isOnboarded) {
      console.log('Redirecting to tabs');
      return <Redirect href="/(tabs)" />;
    } else {
      console.log('Redirecting to onboarding');
      return <Redirect href="/onboarding" />;
    }
  } else {
    console.log('Redirecting to login');
    return <Redirect href="/auth/login" />;
  }
  
  // Show loading indicator while checking auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
});