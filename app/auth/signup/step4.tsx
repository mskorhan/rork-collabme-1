import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignupStep4() {
  const { method, contact, verified } = useLocalSearchParams<{ 
    method: string; 
    contact: string; 
    verified: string; 
  }>();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validateUsername = (value: string): string | null => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    if (usernameAvailable === false) return 'Username is already taken';
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return null;
  };

  const validateConfirmPassword = (value: string): string | null => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  };

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      // Simulate API call to check username availability
      console.log(`Checking username availability: ${value}`);
      
      // For demo purposes, make usernames starting with 'admin' unavailable
      const isAvailable = !value.toLowerCase().startsWith('admin');
      
      setTimeout(() => {
        setUsernameAvailable(isAvailable);
      }, 500);
    } catch (error) {
      console.error('Failed to check username availability:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [username]);

  useEffect(() => {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setIsValid(
      !usernameError && 
      !passwordError && 
      !confirmPasswordError && 
      username.length > 0 && 
      password.length > 0 && 
      confirmPassword.length > 0 &&
      usernameAvailable === true
    );
  }, [username, password, confirmPassword, usernameAvailable]);

  const getPasswordStrength = (value: string): { score: number; text: string; color: string } => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/(?=.*[a-z])/.test(value)) score++;
    if (/(?=.*[A-Z])/.test(value)) score++;
    if (/(?=.*\d)/.test(value)) score++;
    if (/(?=.*[!@#$%^&*])/.test(value)) score++;

    if (score <= 2) return { score, text: 'Weak', color: colors.error };
    if (score <= 3) return { score, text: 'Fair', color: colors.warning };
    if (score <= 4) return { score, text: 'Good', color: colors.primary };
    return { score, text: 'Strong', color: colors.success };
  };

  const handleContinue = () => {
    if (!isValid) {
      Alert.alert('Invalid Input', 'Please fix the errors above');
      return;
    }

    router.push(`/auth/signup/step5?method=${method}&contact=${encodeURIComponent(contact)}&username=${username}&password=${encodeURIComponent(password)}`);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Account Setup',
          headerBackTitle: 'Back',
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Choose a username and secure password for your account
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            validate={validateUsername}
            success={usernameAvailable === true ? 'Username is available!' : undefined}
            required
            autoFocus
          />

          <AuthInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            validate={validatePassword}
            required
          />

          {password.length > 0 && (
            <View style={styles.passwordStrength}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Password Strength:</Text>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor: level <= passwordStrength.score 
                          ? passwordStrength.color 
                          : colors.gray[200]
                      }
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            validate={validateConfirmPassword}
            required
          />
        </View>

        <View style={styles.footer}>
          <AuthButton
            title="Next"
            onPress={handleContinue}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  passwordStrength: {
    marginBottom: 20,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  strengthBar: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  footer: {
    marginTop: 40,
  },
});