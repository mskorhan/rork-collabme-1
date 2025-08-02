import { Job } from '@/types';

export const mockJobs: Job[] = [
  {
    id: '1',
    companyId: '101',
    title: 'Lead Actor for Independent Feature Film',
    company: {
      name: 'Visionary Studios',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    description: 'Seeking a lead actor for our upcoming independent feature film "Echoes of Tomorrow". The story follows a time-traveling scientist trying to prevent a global catastrophe.',
    requirements: [
      'Professional acting experience',
      'Age range: 30-45',
      'Ability to portray complex emotions',
      'Available for 6-week shoot in Los Angeles',
    ],
    location: {
      city: 'Los Angeles',
      country: 'USA',
      remote: false,
    },
    type: 'contract',
    salary: '$5,000 - $8,000',
    compensation: '$5,000 - $8,000',
    postedAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    deadline: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks from now
    remote: false,
    urgent: false,
    applicants: ['1', '6'],
  },
  {
    id: '2',
    companyId: '101',
    title: 'Cinematographer for Documentary Series',
    company: {
      name: 'Visionary Studios',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    description: 'Looking for an experienced cinematographer for our upcoming 5-part documentary series about climate change. The project will involve travel to various locations around the world.',
    requirements: [
      'Minimum 3 years experience in documentary filmmaking',
      'Own equipment preferred',
      'Experience shooting in challenging environments',
      'Available for international travel',
    ],
    location: {
      city: 'Los Angeles',
      country: 'USA',
      remote: false,
    },
    type: 'contract',
    salary: '$10,000 - $15,000',
    compensation: '$10,000 - $15,000 for the series',
    postedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    deadline: new Date(Date.now() + 864000000).toISOString(), // 10 days from now
    remote: false,
    urgent: false,
    applicants: ['2'],
  },
  {
    id: '3',
    companyId: '102',
    title: 'Models for Fashion Campaign',
    company: {
      name: 'Elite Talent Agency',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    description: 'Elite Talent Agency is casting models for an upcoming high-fashion campaign for a luxury brand. The shoot will take place in New York City.',
    requirements: [
      'Professional modeling experience',
      'Height: 5\'9" - 6\'2"',
      'Ages 18-30',
      'All ethnicities welcome',
    ],
    location: {
      city: 'New York',
      country: 'USA',
      remote: false,
    },
    type: 'freelance',
    salary: '$2,000 per day',
    compensation: '$2,000 per day',
    postedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    deadline: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    remote: false,
    urgent: true,
    applicants: ['3'],
  },
  {
    id: '4',
    companyId: '104',
    title: 'Motion Graphics Designer',
    company: {
      name: 'Pixel Perfect Media',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    description: 'Pixel Perfect Media is looking for a talented Motion Graphics Designer to join our team. This is a full-time position with the possibility of remote work.',
    requirements: [
      'Proficiency in After Effects and Cinema 4D',
      'Strong portfolio demonstrating motion graphics skills',
      'At least 2 years of professional experience',
      'Knowledge of current design trends',
    ],
    location: {
      city: 'San Francisco',
      country: 'USA',
      remote: true,
    },
    type: 'full-time',
    salary: '$70,000 - $90,000',
    compensation: '$70,000 - $90,000 per year',
    postedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deadline: new Date(Date.now() + 1728000000).toISOString(), // 20 days from now
    remote: true,
    urgent: false,
    applicants: ['4'],
  },
  {
    id: '5',
    companyId: '103',
    title: 'Music Producer for Upcoming Album',
    company: {
      name: 'Rhythm Records',
      logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    description: 'Rhythm Records is seeking a music producer to work on an upcoming R&B album. The ideal candidate will have experience in R&B, soul, and hip-hop production.',
    requirements: [
      'Proven track record in R&B production',
      'Strong understanding of music theory',
      'Experience with Pro Tools or Logic Pro',
      'Available for in-studio sessions in Atlanta',
    ],
    location: {
      city: 'Atlanta',
      country: 'USA',
      remote: false,
    },
    type: 'contract',
    salary: 'Competitive + Royalties',
    compensation: 'Competitive + Royalties',
    postedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deadline: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    remote: false,
    urgent: true,
    applicants: [],
  },
];

export default mockJobs;