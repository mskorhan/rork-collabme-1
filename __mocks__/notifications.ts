import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'like',
    relatedId: '1',
    relatedPostId: '1',
    message: 'Michael Chen liked your post',
    read: false,
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: 'n2',
    userId: '1',
    type: 'comment',
    relatedId: '1',
    relatedPostId: '1',
    message: 'Sophia Rodriguez commented on your post: "Looking amazing! Can\'t wait to see the final photos."',
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 'n3',
    userId: '101',
    type: 'collab_request',
    relatedId: 'collab_1',
    relatedCollabId: 'collab_1',
    message: 'Horizon Studios sent you a collaboration request for "Commercial Video Production"',
    read: true,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'n4',
    userId: '1',
    type: 'message',
    relatedId: 'c3',
    message: 'You have 2 new messages from Elite Talent Agency',
    read: false,
    createdAt: Date.now() - 39600000, // 11 hours ago
  },
  {
    id: 'n5',
    userId: '1',
    type: 'job_application',
    relatedId: 'job_1',
    relatedJobId: 'job_1',
    message: 'Your application for "Lead Actor for Independent Feature Film" has been reviewed',
    read: true,
    createdAt: Date.now() - 172800000, // 2 days ago
  },
  {
    id: 'n6',
    userId: '1',
    type: 'like',
    relatedId: '1',
    relatedPostId: '1',
    message: 'Olivia Taylor and 2 others liked your post',
    read: true,
    createdAt: Date.now() - 259200000, // 3 days ago
  },
  {
    id: 'n7',
    userId: '3',
    type: 'collab_request',
    relatedId: 'collab_2',
    relatedCollabId: 'collab_2',
    message: 'Sophia Rodriguez accepted your collaboration request',
    read: true,
    createdAt: Date.now() - 345600000, // 4 days ago
  },
  {
    id: 'n8',
    userId: '2',
    type: 'follow',
    relatedId: '2',
    relatedUserId: '2',
    message: 'Michael Chen started following you',
    read: false,
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: 'n9',
    userId: '3',
    type: 'collab_request',
    relatedId: 'collab_3',
    relatedCollabId: 'collab_3',
    message: 'Sophia Rodriguez sent you a collaboration request for "Fashion Editorial Shoot"',
    read: false,
    createdAt: Date.now() - 10800000, // 3 hours ago
  },
  {
    id: 'n10',
    userId: '4',
    type: 'message',
    relatedId: 'c4',
    message: 'You have a new message from David Kim',
    read: false,
    createdAt: Date.now() - 14400000, // 4 hours ago
  },
  {
    id: 'n11',
    userId: '5',
    type: 'job_application',
    relatedId: 'job_2',
    relatedJobId: 'job_2',
    message: 'Emma Wilson applied for your "Brand Ambassador" position',
    read: false,
    createdAt: Date.now() - 518400000, // 6 days ago
  },
  {
    id: 'n12',
    userId: '6',
    type: 'follow',
    relatedId: '6',
    relatedUserId: '6',
    message: 'James Wilson started following you',
    read: false,
    createdAt: Date.now() - 21600000, // 6 hours ago
  },
  {
    id: 'n13',
    userId: '7',
    type: 'collab_request',
    relatedId: 'collab_4',
    relatedCollabId: 'collab_4',
    message: 'Creative Studios wants to collaborate with you on "Music Video Production"',
    read: false,
    createdAt: Date.now() - 43200000, // 12 hours ago
  },
  {
    id: 'n14',
    userId: '8',
    type: 'job_application',
    relatedId: 'job_3',
    relatedJobId: 'job_3',
    message: 'Alex Johnson applied for your "Photographer" position',
    read: false,
    createdAt: Date.now() - 64800000, // 18 hours ago
  },
];

export default mockNotifications;