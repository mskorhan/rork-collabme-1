export interface CollabRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  title: string;
  description: string;
  budget?: string;
  timeline: string;
  status: 'pending' | 'accepted' | 'denied';
  createdAt: number;
  updatedAt: number;
}

export const mockCollabRequests: CollabRequest[] = [
  {
    id: 'collab_1',
    fromUserId: '101',
    toUserId: '1',
    title: 'Commercial Video Production',
    description: 'We are looking for a talented actor to star in our upcoming commercial campaign for a major tech brand. The shoot will take place over 2 days in downtown LA.',
    budget: '$2,500 - $3,500',
    timeline: '2 weeks',
    status: 'pending',
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'collab_2',
    fromUserId: '3',
    toUserId: '1',
    title: 'Fashion Editorial Shoot',
    description: 'Looking for a model for an upcoming fashion editorial for Vogue. The theme is "Urban Elegance" and we need someone with strong editorial experience.',
    budget: '$1,800 - $2,200',
    timeline: '1 week',
    status: 'accepted',
    createdAt: Date.now() - 345600000, // 4 days ago
    updatedAt: Date.now() - 300000000,
  },
  {
    id: 'collab_3',
    fromUserId: '3',
    toUserId: '1',
    title: 'Fashion Editorial Shoot',
    description: 'Exciting opportunity to work on a high-fashion editorial spread. We\'re looking for someone who can bring both elegance and edge to the shoot.',
    budget: '$2,000 - $2,800',
    timeline: '3 days',
    status: 'pending',
    createdAt: Date.now() - 10800000, // 3 hours ago
    updatedAt: Date.now() - 10800000,
  },
  {
    id: 'collab_4',
    fromUserId: '7',
    toUserId: '1',
    title: 'Music Video Production',
    description: 'We\'re producing a music video for an up-and-coming artist and need a charismatic performer to be featured alongside the artist.',
    budget: '$1,500 - $2,000',
    timeline: '1 week',
    status: 'pending',
    createdAt: Date.now() - 43200000, // 12 hours ago
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'collab_5',
    fromUserId: '5',
    toUserId: '1',
    title: 'Brand Ambassador Campaign',
    description: 'Looking for a brand ambassador for our sustainable fashion line. This is a long-term partnership opportunity with great exposure.',
    budget: '$3,000 - $4,000',
    timeline: '1 month',
    status: 'denied',
    createdAt: Date.now() - 604800000, // 1 week ago
    updatedAt: Date.now() - 500000000,
  },
];