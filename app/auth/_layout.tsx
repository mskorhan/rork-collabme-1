import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Sign In',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Sign Up',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup/step1" 
        options={{ 
          title: 'Sign Up',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup/step2" 
        options={{ 
          title: 'Contact Info',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup/step3" 
        options={{ 
          title: 'Verification',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup/step4" 
        options={{ 
          title: 'Account Setup',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="signup/step5" 
        options={{ 
          title: 'Profile Setup',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}