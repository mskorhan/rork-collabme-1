export type UserType = 'creative' | 'company';

export type CreativeRole = 
  | 'actor'
  | 'actress'
  | 'model'
  | 'director'
  | 'producer'
  | 'photographer'
  | 'videographer'
  | 'gfx_designer'
  | 'makeup_artist'
  | 'stylist'
  | 'writer'
  | 'musician'
  | 'dancer'
  | 'other';

export type CompanyType = 
  | 'production_studio'
  | 'music_studio'
  | 'agency'
  | 'talent_agency'
  | 'brand'
  | 'media_company'
  | 'record_label'
  | 'media_agency'
  | 'other';

export type SubscriptionTier = 'free' | 'gold' | 'diamond';

export type OnlineStatus = 'online' | 'offline' | 'away';
export type WorkStatus = 'available' | 'busy' | 'not_available';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  userType: UserType;
  role?: CreativeRole;
  companyType?: CompanyType;
  verified: boolean;
  followers: number;
  following: number;
  posts: number;
  rating?: number; // Star rating out of 5
  subscriptionTier: SubscriptionTier;
  portfolio?: {
    images?: string[];
    videos?: string[];
    documents?: string[];
  };
  skills?: string[];
  experience?: string;
  website?: string;
  email?: string;
  phone?: string;
  onlineStatus?: OnlineStatus;
  workStatus?: WorkStatus;
  isVerified?: boolean;
  profileImage?: string;
}

export interface CreativeProfile extends UserProfile {
  role: CreativeRole;
  physicalAttributes?: {
    hairColor?: string;
    eyeColor?: string;
    height?: number;
    weight?: number;
    age?: number;
    ethnicity?: string;
    bodyType?: string;
  };
  portfolio?: {
    images?: string[];
    videos?: string[];
    documents?: string[];
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    youtube?: string;
    tiktok?: string;
    spotify?: string;
  };
}

export interface CompanyProfile extends UserProfile {
  companyType: CompanyType;
  expertise?: string[];
  portfolio?: {
    images?: string[];
    videos?: string[];
    documents?: string[];
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'audio' | 'pdf' | 'text';
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number; // for audio/video
  coverArt?: string; // for audio
  tags: string[];
  mentions: string[];
  likes: string[];
  comments: Comment[];
  createdAt: number;
  updatedAt: number;
  isSponsored?: boolean;
  sponsorInfo?: {
    brandName: string;
    brandLogo: string;
  };
  hashtags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: string[];
  replies: Comment[];
  createdAt: number;
}

export interface JobLocation {
  city: string;
  country: string;
  remote: boolean;
}

export interface JobCompany {
  name: string;
  logo: string;
}

export interface Job {
  id: string;
  title: string;
  company: JobCompany;
  companyId: string;
  location: JobLocation;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salary?: string;
  compensation?: string;
  description: string;
  requirements: string[];
  postedAt: string;
  createdAt: string;
  deadline?: string;
  remote: boolean;
  urgent: boolean;
  applicants: string[];
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  type: 'paid' | 'unpaid' | 'revenue-share';
  budget?: string;
  location: string;
  remote: boolean;
  deadline?: string;
  skillsNeeded: string[];
  applicants: number;
  postedAt: string;
  urgent: boolean;
}

export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  content?: string;
  type: 'photo' | 'video';
  duration?: number;
  createdAt: number;
  expiresAt: number;
  viewers: string[];
  views?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  fileName?: string;
  sentAt?: string;
  createdAt: number;
  readAt?: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: number;
  updatedAt: number;
  pinnedBy?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'collab_request' | 'job_application' | 'mention' | 'tag' | 'message';
  title?: string;
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
  relatedId?: string;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedJobId?: string;
  relatedCollabId?: string;
}

export interface FilterLimits {
  maxFilters: number;
  canFilterByAppearance: boolean;
  canFilterByLocation: boolean;
  canFilterByMultipleRoles: boolean;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  projectTitle?: string;
  createdAt: number;
}

export interface CollabHistory {
  id: string;
  title: string;
  participants: string[];
  status: 'completed' | 'ongoing' | 'cancelled';
  rating?: number;
  review?: string;
  completedAt?: number;
  createdAt: number;
}