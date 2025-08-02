import { CreativeRole, CompanyType } from '@/types';

export const CREATIVE_ROLES: { id: CreativeRole; label: string }[] = [
  { id: 'actor', label: 'Actor' },
  { id: 'actress', label: 'Actress' },
  { id: 'model', label: 'Model' },
  { id: 'director', label: 'Director' },
  { id: 'producer', label: 'Producer' },
  { id: 'photographer', label: 'Photographer' },
  { id: 'videographer', label: 'Videographer' },
  { id: 'gfx_designer', label: 'GFX Designer' },
  { id: 'makeup_artist', label: 'Makeup Artist' },
  { id: 'stylist', label: 'Stylist' },
  { id: 'writer', label: 'Writer' },
  { id: 'musician', label: 'Musician' },
  { id: 'dancer', label: 'Dancer' },
  { id: 'other', label: 'Other' },
] as const;

export const COMPANY_TYPES: { id: CompanyType; label: string }[] = [
  { id: 'production_studio', label: 'Production Studio' },
  { id: 'music_studio', label: 'Music Studio' },
  { id: 'agency', label: 'Agency' },
  { id: 'talent_agency', label: 'Talent Agency' },
  { id: 'brand', label: 'Brand' },
  { id: 'media_company', label: 'Media Company' },
  { id: 'other', label: 'Other' },
] as const;

export const APPEARANCE_FILTERS = [
  'Blonde Hair',
  'Brown Hair',
  'Black Hair',
  'Red Hair',
  'Blue Eyes',
  'Brown Eyes',
  'Green Eyes',
  'Hazel Eyes',
  'Athletic Build',
  'Slim Build',
  'Average Build',
  'Plus Size',
  'Tall (6ft+)',
  'Average Height',
  'Petite',
] as const;

export const LOCATION_FILTERS = [
  'Los Angeles',
  'New York',
  'London',
  'Toronto',
  'Vancouver',
  'Atlanta',
  'Chicago',
  'Miami',
  'San Francisco',
  'Nashville',
  'Barcelona',
  'Sydney',
  'Mumbai',
] as const;