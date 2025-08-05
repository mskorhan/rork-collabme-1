import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { OtpInput } from '@/components/auth/OtpInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignupStep3() {
  const { method, contact } = useLocalSearchParams<{ method: string; contact: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Simulate sending OTP on component mount
    sendOtp();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const sendOtp = async () => {
    try {
      // Simulate API call to send OTP
      console.log(`Sending OTP to ${contact} via ${method}`);
      // In real app, call your backend API here
      // await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ method, contact }) });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setCanResend(false);
    setCountdown(60);
    
    try {
      await sendOtp();
      Alert.alert('Code Sent', 'A new verification code has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification code.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpComplete = async (otpValue: string) => {
    setOtp(otpValue);
    await verifyOtp(otpValue);
  };

  const verifyOtp = async (otpValue: string) => {
    setLoading(true);
    
    try {
      // Simulate API call to verify OTP
      console.log(`Verifying OTP: ${otpValue} for ${contact}`);
      
      // For demo purposes, accept any 6-digit code
      if (otpValue.length === 6) {
        // In real app, call your backend API here
        // const response = await fetch('/api/auth/verify-otp', { 
        //   method: 'POST', 
        //   body: JSON.stringify({ method, contact, otp: otpValue }) 
        // });
        
        setTimeout(() => {
          setLoading(false);
          router.push(`/auth/signup/step4?method=${method}&contact=${encodeURIComponent(contact)}&verified=true`);
        }, 1500);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect. Please try again.');
      setOtp('');
    }
  };

  const handleContinue = () => {
    if (otp.length === 6) {
      verifyOtp(otp);
    } else {
      Alert.alert('Incomplete Code', 'Please enter the complete 6-digit verification code.');
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    return `Verify your ${method === 'email' ? 'email' : 'phone number'}`;
  };

  const getSubtitle = () => {
    const maskedContact = method === 'email' 
      ? contact.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : contact.replace(/(\+?\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1***$3$4');
    
    return `We sent a 6-digit code to ${maskedContact}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Verification',
          headerBackTitle: 'Back',
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.otpContainer}>
          <OtpInput
            length={6}
            onComplete={handleOtpComplete}
            onChangeText={setOtp}
            disabled={loading}
            autoFocus
          />
        </View>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp} disabled={resendLoading}>
              <Text style={styles.resendText}>
                {resendLoading ? 'Sending...' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Resend in {formatCountdown(countdown)}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <AuthButton
            title="Verify"
            onPress={handleContinue}
            disabled={otp.length !== 6}
            loading={loading}
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
  otpContainer: {
    marginBottom: 30,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 16,
    color: colors.gray[500],
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});