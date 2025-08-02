import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface TabBadgeProps {
  count: number;
  children: React.ReactNode;
}

export const TabBadge: React.FC<TabBadgeProps> = ({ count, children }) => {
  return (
    <View style={styles.container}>
      {children}
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -theme.spacing.sm,
    right: -theme.spacing.sm,
    backgroundColor: theme.colors.primary500,
    borderRadius: theme.spacing.sm + 2,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.white,
    zIndex: 10,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '700' as const,
    textAlign: 'center',
    lineHeight: 12,
  },
});