import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'like',
    relatedId: '1', // Post ID
    message: 'Michael Chen liked your post',
    read: false,
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: 'n2',
    userId: '1',
    type: 'comment',
    relatedId: '1', // Post ID
    message: 'Sophia Rodriguez commented on your post: "Looking amazing! Can\'t wait to see the final photos."',
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 'n3',
    userId: '1',
    type: 'collab_request',
    relatedId: '101', // User ID
    message: 'Horizon Studios sent you a collaboration request',
    read: true,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'n4',
    userId: '1',
    type: 'message',
    relatedId: 'c3', // Conversation ID
    message: 'You have 2 new messages from Elite Talent Agency',
    read: false,
    createdAt: Date.now() - 39600000, // 11 hours ago
  },
  {
    id: 'n5',
    userId: '1',
    type: 'job_application',
    relatedId: '1', // Job ID
    message: 'Your application for "Lead Actor for Independent Feature Film" has been reviewed',
    read: true,
    createdAt: Date.now() - 172800000, // 2 days ago
  },
  {
    id: 'n6',
    userId: '1',
    type: 'like',
    relatedId: '1', // Post ID
    message: 'Olivia Taylor and 2 others liked your post',
    read: true,
    createdAt: Date.now() - 259200000, // 3 days ago
  },
  {
    id: 'n7',
    userId: '1',
    type: 'collab_request',
    relatedId: '3', // User ID
    message: 'Sophia Rodriguez accepted your collaboration request',
    read: true,
    createdAt: Date.now() - 345600000, // 4 days ago
  },
  {
    id: 'n8',
    userId: '2',
    type: 'follow',
    relatedId: '2', // User ID
    message: 'Michael Chen started following you',
    read: false,
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: 'n9',
    userId: '3',
    type: 'collab_request',
    relatedId: '3', // User ID
    message: 'Sophia Rodriguez sent you a collaboration request for "Fashion Editorial Shoot"',
    read: false,
    createdAt: Date.now() - 10800000, // 3 hours ago
  },
  {
    id: 'n10',
    userId: '4',
    type: 'message',
    relatedId: 'c4', // Conversation ID
    message: 'You have a new message from David Kim',
    read: false,
    createdAt: Date.now() - 14400000, // 4 hours ago
  },
  {
    id: 'n11',
    userId: '5',
    type: 'job_application',
    relatedId: '2', // Job ID
    message: 'Your application for "Brand Ambassador" has been accepted',
    read: true,
    createdAt: Date.now() - 518400000, // 6 days ago
  },
];

export default mockNotifications;