import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignupStep2() {
  const { method } = useLocalSearchParams<{ method: string }>();
  const [contact, setContact] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return null;
  };

  const validateContact = (value: string): string | null => {
    if (method === 'email') {
      return validateEmail(value);
    } else if (method === 'phone') {
      return validatePhone(value);
    }
    return 'Invalid contact method';
  };

  useEffect(() => {
    const validation = validateContact(contact);
    setIsValid(!validation && contact.length > 0);
  }, [contact, method]);

  const handleContinue = () => {
    if (!isValid) {
      Alert.alert('Invalid Input', 'Please enter a valid contact method');
      return;
    }

    router.push(`/auth/signup/step3?method=${method}&contact=${encodeURIComponent(contact)}`);
  };

  const getTitle = () => {
    return method === 'email' ? 'Enter your email' : 'Enter your phone number';
  };

  const getSubtitle = () => {
    return method === 'email' 
      ? 'We&apos;ll send a verification code to this email address'
      : 'We&apos;ll send a verification code to this phone number';
  };

  const getPlaceholder = () => {
    return method === 'email' ? 'your@email.com' : '+1 (555) 123-4567';
  };

  const getKeyboardType = () => {
    return method === 'email' ? 'email-address' : 'phone-pad';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Contact Information',
          headerBackTitle: 'Back',
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label={method === 'email' ? 'Email Address' : 'Phone Number'}
            placeholder={getPlaceholder()}
            value={contact}
            onChangeText={setContact}
            keyboardType={getKeyboardType()}
            autoCapitalize="none"
            validate={validateContact}
            required
            autoFocus
          />
        </View>

        <View style={styles.footer}>
          <AuthButton
            title="Continue"
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
  footer: {
    marginTop: 40,
  },
});