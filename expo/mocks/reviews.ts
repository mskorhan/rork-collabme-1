import { Review } from '@/types';

export const mockReviews: Review[] = [
  {
    id: 'r1',
    fromUserId: '2',
    toUserId: '1',
    rating: 5,
    comment: 'Amazing photographer! Very professional and delivered stunning results. Would definitely work with again.',
    projectTitle: 'Fashion Photoshoot',
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'r2',
    fromUserId: '3',
    toUserId: '1',
    rating: 4,
    comment: 'Great collaboration on the music video. Creative vision and excellent execution.',
    projectTitle: 'Music Video Production',
    createdAt: Date.now() - 172800000, // 2 days ago
  },
  {
    id: 'r3',
    fromUserId: '4',
    toUserId: '1',
    rating: 5,
    comment: 'Outstanding work ethic and talent. Brought our brand campaign to life perfectly.',
    projectTitle: 'Brand Campaign',
    createdAt: Date.now() - 259200000, // 3 days ago
  },
  {
    id: 'r4',
    fromUserId: '5',
    toUserId: '1',
    rating: 4,
    comment: 'Professional and reliable. Delivered high-quality content on time.',
    projectTitle: 'Social Media Content',
    createdAt: Date.now() - 345600000, // 4 days ago
  },
  {
    id: 'r5',
    fromUserId: '6',
    toUserId: '1',
    rating: 5,
    comment: 'Incredible talent and easy to work with. The final product exceeded expectations.',
    projectTitle: 'Commercial Shoot',
    createdAt: Date.now() - 432000000, // 5 days ago
  },
];

export default mockReviews;