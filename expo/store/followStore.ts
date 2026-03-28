import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FollowState {
  following: string[];
  followers: string[];
  
  // Actions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  addFollower: (userId: string) => void;
  removeFollower: (userId: string) => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      following: [],
      followers: [],
      
      followUser: (userId) => 
        set((state) => ({
          following: state.following.includes(userId) 
            ? state.following 
            : [...state.following, userId],
        })),
      
      unfollowUser: (userId) => 
        set((state) => ({
          following: state.following.filter(id => id !== userId),
        })),
      
      isFollowing: (userId) => {
        const state = get();
        return state.following.includes(userId);
      },
      
      addFollower: (userId) => 
        set((state) => ({
          followers: state.followers.includes(userId) 
            ? state.followers 
            : [...state.followers, userId],
        })),
      
      removeFollower: (userId) => 
        set((state) => ({
          followers: state.followers.filter(id => id !== userId),
        })),
    }),
    {
      name: 'follow-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);