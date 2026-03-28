import { CollabHistory } from '@/types';

export const mockCollabHistory: CollabHistory[] = [
  {
    id: 'ch1',
    title: 'Fashion Photoshoot',
    participants: ['1', '2'],
    status: 'completed',
    rating: 5,
    review: 'Amazing photographer! Very professional and delivered stunning results.',
    completedAt: Date.now() - 86400000, // 1 day ago
    createdAt: Date.now() - 604800000, // 1 week ago
  },
  {
    id: 'ch2',
    title: 'Music Video Production',
    participants: ['1', '3'],
    status: 'completed',
    rating: 4,
    review: 'Great collaboration on the music video. Creative vision and excellent execution.',
    completedAt: Date.now() - 172800000, // 2 days ago
    createdAt: Date.now() - 1209600000, // 2 weeks ago
  },
  {
    id: 'ch3',
    title: 'Brand Campaign',
    participants: ['1', '4'],
    status: 'completed',
    rating: 5,
    review: 'Outstanding work ethic and talent. Brought our brand campaign to life perfectly.',
    completedAt: Date.now() - 259200000, // 3 days ago
    createdAt: Date.now() - 1814400000, // 3 weeks ago
  },
  {
    id: 'ch4',
    title: 'Social Media Content',
    participants: ['1', '5'],
    status: 'ongoing',
    createdAt: Date.now() - 432000000, // 5 days ago
  },
  {
    id: 'ch5',
    title: 'Commercial Shoot',
    participants: ['1', '6'],
    status: 'completed',
    rating: 5,
    review: 'Incredible talent and easy to work with. The final product exceeded expectations.',
    completedAt: Date.now() - 432000000, // 5 days ago
    createdAt: Date.now() - 2419200000, // 4 weeks ago
  },
];

export default mockCollabHistory;