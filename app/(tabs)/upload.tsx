import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function UploadScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Upload',
          headerShown: false,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Upload</Text>
        <Text style={styles.subtitle}>Create and share your content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
  },
});