// All TypeScript types for 4K Movie Kesri Surat
// Single import: import type { Event, Staff, ... } from '@/types'

// ─── Admin / Auth ──────────────────────────────────────────────────────────
export type AdminRole = 'owner' | 'admin' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  createdAt: number;
  lastLogin?: number;
  profilePhoto?: string;
}

// ─── Events ───────────────────────────────────────────────────────────────
export type EventType =
  | 'wedding'
  | 'engagement'
  | 'corporate'
  | 'portrait'
  | 'product'
  | 'birthday'
  | 'maternity'
  | 'other';

export type EventStatus =
  | 'planned'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'completed';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: number; // timestamp
  time: string; // "18:00"
  reachTime: string; // staff arrival time "16:00"
  location: string;
  locationLink?: string;
  locationLat?: number;
  locationLng?: number;
  duration: string;
  description: string;
  budget: number;
  status: EventStatus;
  teamLeadId: string;
  staffIds: string[];
  equipmentIds: string[];
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  notes?: string;
  reminderSent: boolean;
  reminderDate?: number;
  timelineNotes?: TimelineNote[];
  googleDriveAlbumLink?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineNote {
  id: string;
  text: string;
  createdAt: number;
  createdBy: string;
}

// ─── Staff ────────────────────────────────────────────────────────────────
export type StaffPosition =
  | 'photographer'
  | 'videographer'
  | 'assistant'
  | 'editor'
  | 'stylist'
  | 'other';

export interface Staff {
  id: string;
  name: string;
  position: StaffPosition;
  email: string;
  phone: string;
  salary?: number;
  skills: string[];
  profilePhoto?: string;
  assignedEquipmentIds: string[];
  availability: {
    mon: boolean; tue: boolean; wed: boolean;
    thu: boolean; fri: boolean; sat: boolean; sun: boolean;
  };
  performanceNotes?: string;
  isActive: boolean;
  createdAt: number;
}

// ─── Equipment ────────────────────────────────────────────────────────────
export type EquipmentCategory =
  | 'camera'
  | 'lens'
  | 'light'
  | 'tripod'
  | 'audio'
  | 'drone'
  | 'accessory'
  | 'other';

export type EquipmentCondition = 'available' | 'in-repair' | 'sold';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  condition: EquipmentCondition;
  serialNumber?: string;
  purchaseDate?: number;
  lastMaintenance?: number;
  assignedStaffId?: string;
  images: string[];
  imageUrl?: string;
  cost?: number;
  notes?: string;
  createdAt: number;
}

// ─── Gallery ──────────────────────────────────────────────────────────────
export type GalleryCategory =
  | 'wedding'
  | 'engagement'
  | 'portrait'
  | 'corporate'
  | 'product'
  | 'event'
  | 'other';

export interface GalleryPhoto {
  id: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  equipment?: string;
  photographer?: string;
  featured: boolean;
  order?: number;
  tags: string[];
  width?: number;
  height?: number;
  uploadedAt: number;
}

// ─── YouTube Videos ───────────────────────────────────────────────────────
export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category: GalleryCategory;
  duration?: string;
  featured: boolean;
  order: number;
  createdAt: number;
}

// ─── Blog ─────────────────────────────────────────────────────────────────
export type BlogStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // TipTap JSON as string
  coverImage?: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: BlogStatus;
  publishedAt?: number;
  scheduledAt?: number;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  readingTime?: number;
  createdAt: number;
  updatedAt: number;
}

// ─── Testimonials ─────────────────────────────────────────────────────────
export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto?: string;
  eventType: string;
  rating: number; // 1-5
  text: string;
  status: TestimonialStatus;
  featured: boolean;
  createdAt: number;
}

// ─── Contact / Inquiry ────────────────────────────────────────────────────
export type InquiryStatus = 'new' | 'read' | 'responded';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate?: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  response?: string;
  respondedAt?: number;
  source?: string;
  createdAt: number;
}

// ─── Site Settings ────────────────────────────────────────────────────────
export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  mapLat: number;
  mapLng: number;
  businessHours: Record<string, string>;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
  seoDefaults: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

// ─── Content Sections ─────────────────────────────────────────────────────
export interface ContentSection {
  id: string;
  sectionKey: string; // e.g., "home_hero"
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isVisible: boolean;
  updatedAt: number;
}

// ─── Client Albums (Google Drive) ─────────────────────────────────────────
export interface ClientAlbum {
  id: string;
  eventId: string;
  eventName: string;
  clientName: string;
  driveLink: string;
  accessToken: string; // SHA256 hash for magic link
  isActive: boolean;
  createdAt: number;
}

// ─── API Responses ────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
