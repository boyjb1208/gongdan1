export type InquiryStatus = 'pending' | 'contacted' | 'completed';

export interface Inquiry {
  id?: string;
  name: string;
  contact: string;
  carType: string;
  carYear: string;
  location: string;
  message?: string;
  status: InquiryStatus;
  memo?: string;
  createdAt: Date;
}

export type PostCategory = 'notice' | 'blog';

export interface Post {
  id?: string;
  title: string;
  summary?: string;
  content: string;
  category: PostCategory;
  thumbnail?: string;
  createdAt: Date;
}

export interface Review {
  id?: string;
  name: string;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  companyName: string;
  address: string;
  phone: string;
  hours: string;
  primaryColor: string;
  metaTitle: string;
  metaDescription: string;
}
