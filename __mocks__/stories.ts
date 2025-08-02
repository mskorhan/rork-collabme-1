import { Story } from '@/types';

const now = Date.now();
const twentyFourHours = 24 * 60 * 60 * 1000;

export const mockStories: Story[] = [
  // User 1 stories
  {
    id: 's1',
    userId: '1',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 3600000, // 1 hour ago
    expiresAt: now - 3600000 + twentyFourHours,
    viewers: ['2', '3', '4'],
    views: ['2', '3', '4'],
  },
  {
    id: 's1b',
    userId: '1',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 3000000, // 50 minutes ago
    expiresAt: now - 3000000 + twentyFourHours,
    viewers: ['2', '3'],
    views: ['2', '3'],
  },
  // User 2 stories
  {
    id: 's2',
    userId: '2',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 7200000, // 2 hours ago
    expiresAt: now - 7200000 + twentyFourHours,
    viewers: ['1', '3', '5'],
    views: ['1', '3', '5'],
  },
  {
    id: 's2b',
    userId: '2',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 6600000, // 1h 50m ago
    expiresAt: now - 6600000 + twentyFourHours,
    viewers: ['1', '3'],
    views: ['1', '3'],
  },
  {
    id: 's2c',
    userId: '2',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 6000000, // 1h 40m ago
    expiresAt: now - 6000000 + twentyFourHours,
    viewers: ['1'],
    views: ['1'],
  },
  // User 3 stories
  {
    id: 's3',
    userId: '3',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 10800000, // 3 hours ago
    expiresAt: now - 10800000 + twentyFourHours,
    viewers: ['1', '2', '4', '5'],
    views: ['1', '2', '4', '5'],
  },
  {
    id: 's3b',
    userId: '3',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 10200000, // 2h 50m ago
    expiresAt: now - 10200000 + twentyFourHours,
    viewers: ['1', '2'],
    views: ['1', '2'],
  },
  // User 4 stories
  {
    id: 's4',
    userId: '4',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 14400000, // 4 hours ago
    expiresAt: now - 14400000 + twentyFourHours,
    viewers: ['1', '2', '3'],
    views: ['1', '2', '3'],
  },
  // User 5 stories
  {
    id: 's5',
    userId: '5',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 18000000, // 5 hours ago
    expiresAt: now - 18000000 + twentyFourHours,
    viewers: ['1', '2', '6'],
    views: ['1', '2', '6'],
  },
  // User 101 stories
  {
    id: 's6',
    userId: '101',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    content: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    createdAt: now - 21600000, // 6 hours ago
    expiresAt: now - 21600000 + twentyFourHours,
    viewers: ['1', '2', '3', '4'],
    views: ['1', '2', '3', '4'],
  },
];

// Helper function to get stories by user
export const getStoriesByUser = (userId: string): Story[] => {
  return mockStories
    .filter(story => story.userId === userId && story.expiresAt > Date.now())
    .sort((a, b) => a.createdAt - b.createdAt);
};

// Helper function to get unique users with stories
export const getUsersWithStories = (): string[] => {
  const now = Date.now();
  const activeStories = mockStories.filter(story => story.expiresAt > now);
  const uniqueUserIds = [...new Set(activeStories.map(story => story.userId))];
  return uniqueUserIds;
};

export default mockStories;