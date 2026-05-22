export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Career {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  height?: string;
  weight?: string;
  resumeUrl: string;
  message?: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  icon: string;
  features: string[];
  order: number;
  image?: string; 
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  thumbnail?: string;
  image?: string; 
  createdAt: string;
}

export interface Client {
  _id: string;
  name: string;
  industry: string;
  logo?: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role?: string;
  content: string;
  message?: string;
  rating?: number;
  status: 'pending' | 'approved' | 'all';
  createdAt: string;
}

export interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  page?: string;
  active?: boolean;
  order?: number;
  createdAt?: string;
}

export interface Stats {
  totalMessages: number;
  totalApplications: number;
  totalServices: number;
  totalBlogs: number;
  totalTestimonials?: number;
  totalClients?: number;
}

export interface Settings {
  _id?: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  contactPhone2?: string;
  whatsappNumber?: string;
  address: string;
  logo?: string;
  favicon?: string;
  heroImage?: string;
  contactImage?: string;
  cctvImage?: string;
  
  // Home Features
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  // Director
  directorName?: string;
  directorRole?: string;
  directorMessage?: string;
  directorImage?: string;

  // Stats
  statsClients?: string;
  statsProjects?: string;
  statsAwards?: string;
  statsExperience?: string;

  // Toggles
  ctaJobEnabled?: boolean;

  // Certifications & Compliance
  isoCertification?: string;
  gstNumber?: string;
  psaraLicense?: string;
  complianceLabels?: string[];

  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };

  [key: string]: any;
}

export interface Navigation {
  _id: string;
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
  isActive: boolean;
  parentId?: string | null;
}

export interface FooterLink {
  _id?: string;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface FooterSection {
  _id: string;
  columnName: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

export interface SEOData {
  _id: string;
  pageRoute: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface Industry {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
}
