import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { AuthButton } from '@/components/auth/AuthButton';

type ContactMethod = 'email' | 'phone' | null;

export default function SignupStep1() {
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod>(null);

  const handleContinue = () => {
    if (selectedMethod) {
      router.push(`/auth/signup/step2?method=${selectedMethod}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerBackTitle: 'Back',
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How would you like to sign up?</Text>
          <Text style={styles.subtitle}>
            Choose your preferred method to create your account
          </Text>
        </View>

        <View style={styles.methodsContainer}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'email' && styles.selectedCard
            ]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.8}
          >
            <View style={[
              styles.iconContainer,
              selectedMethod === 'email' && styles.selectedIconContainer
            ]}>
              <Mail 
                size={32} 
                color={selectedMethod === 'email' ? colors.white : colors.primary} 
              />
            </View>
            <Text style={[
              styles.methodTitle,
              selectedMethod === 'email' && styles.selectedMethodTitle
            ]}>
              Sign up with Email
            </Text>
            <Text style={[
              styles.methodDescription,
              selectedMethod === 'email' && styles.selectedMethodDescription
            ]}>
              We&apos;ll send you a secure verification code to your email address
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'phone' && styles.selectedCard
            ]}
            onPress={() => setSelectedMethod('phone')}
            activeOpacity={0.8}
          >
            <View style={[
              styles.iconContainer,
              selectedMethod === 'phone' && styles.selectedIconContainer
            ]}>
              <Phone 
                size={32} 
                color={selectedMethod === 'phone' ? colors.white : colors.primary} 
              />
            </View>
            <Text style={[
              styles.methodTitle,
              selectedMethod === 'phone' && styles.selectedMethodTitle
            ]}>
              Sign up with Phone
            </Text>
            <Text style={[
              styles.methodDescription,
              selectedMethod === 'phone' && styles.selectedMethodDescription
            ]}>
              We&apos;ll send you a secure SMS verification code to your phone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <AuthButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedMethod}
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
  methodsContainer: {
    flex: 1,
    gap: 20,
  },
  methodCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.gray[25],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedIconContainer: {
    backgroundColor: colors.primary,
  },
  methodTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedMethodTitle: {
    color: colors.primary,
  },
  methodDescription: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedMethodDescription: {
    color: colors.gray[700],
  },
  footer: {
    marginTop: 40,
  },
});