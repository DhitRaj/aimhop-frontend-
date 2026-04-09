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
  resumeUrl: string;
  message?: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
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
  address: string;
  logo?: string;
  favicon?: string;
  heroImage?: string;
  
  // Home Features
  feature1Title: string;
  feature1Desc: string;
  feature1Icon?: string;
  feature2Title: string;
  feature2Desc: string;
  feature2Icon?: string;
  feature3Title: string;
  feature3Desc: string;
  feature3Icon?: string;

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
  ctaBrochureEnabled?: boolean;
  ctaSafetyAuditEnabled?: boolean;

  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };

  [key: string]: any;
}
