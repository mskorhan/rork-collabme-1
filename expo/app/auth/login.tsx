import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  
  // Email validation
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };
  
  const handleLogin = () => {
    setError('');
    
    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setError('Please fix the errors above');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, any email/password combination works
      setAuthenticated('1', 'creative', 'gold');
      router.replace('/(tabs)');
    }, 1500);
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Collab Me</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            validate={validateEmail}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            validate={validatePassword}
            containerStyle={styles.inputContainer}
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.button}
          />
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <View style={styles.socialButtonsContainer}>
            <Button
              title="Google"
              onPress={() => {}}
              variant="outline"
              style={styles.socialButton}
            />
            
            <Button
              title="Apple"
              onPress={() => {}}
              variant="outline"
              style={styles.socialButton}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 24,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  button: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray[500],
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: colors.gray[500],
    marginRight: 4,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '500',
  },
});