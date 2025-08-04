import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Home, Search, Handshake, Briefcase, Activity, User } from 'lucide-react-native';
import { TabBadge } from '@/components/TabBadge';
import { useNotificationStore } from '@/store/notificationStore';

const TabBarIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => (
  <View style={styles.tabIconContainer}>
    {children}
  </View>
);

export default function TabLayout() {
  const { unreadCount, loadNotifications } = useNotificationStore();
  
  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          borderTopWidth: 0.5,
          borderTopColor: colors.gray[200],
          borderRadius: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: colors.white,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: colors.text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <Home size={24} color={focused ? colors.primary : color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <Search size={24} color={focused ? colors.primary : color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="collab"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <Handshake size={24} color={focused ? colors.primary : color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <Briefcase size={24} color={focused ? colors.primary : color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <TabBadge count={unreadCount}>
                <Activity size={24} color={focused ? colors.primary : color} />
              </TabBadge>
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <User size={24} color={focused ? colors.primary : color} />
            </TabBarIcon>
          ),
        }}
      />
      
      {/* Hidden tabs - these exist as files but shouldn't show in tab bar */}
      <Tabs.Screen
        name="upload"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
});