import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier, UserType } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
  userType: UserType | null;
  subscriptionTier: SubscriptionTier | null;
  
  // Actions
  setAuthenticated: (userId: string, userType: UserType, tier: SubscriptionTier) => void;
  setOnboarded: (onboarded: boolean) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isOnboarded: false,
      userId: null,
      userType: null,
      subscriptionTier: 'free',
      
      setAuthenticated: (userId, userType, tier) => set({ 
        isAuthenticated: true, 
        userId, 
        userType, 
        subscriptionTier: tier 
      }),
      
      setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
      
      setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
      
      logout: () => set({ 
        isAuthenticated: false, 
        isOnboarded: false, 
        userId: null, 
        userType: null, 
        subscriptionTier: 'free' 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);