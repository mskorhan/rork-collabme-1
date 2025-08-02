import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreativeProfile, CompanyProfile, UserType, CreativeRole, CompanyType } from '@/types';

interface UserState {
  profile: CreativeProfile | CompanyProfile | null;
  
  // Actions
  setCreativeProfile: (profile: Partial<CreativeProfile>) => void;
  setCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  updateProfile: (updates: Partial<CreativeProfile | CompanyProfile>) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      
      setCreativeProfile: (profile) => 
        set((state) => ({
          profile: {
            ...(state.profile as CreativeProfile || {}),
            ...profile,
          } as CreativeProfile,
        })),
      
      setCompanyProfile: (profile) => 
        set((state) => ({
          profile: {
            ...(state.profile as CompanyProfile || {}),
            ...profile,
          } as CompanyProfile,
        })),
      
      updateProfile: (updates) => 
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
      
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);