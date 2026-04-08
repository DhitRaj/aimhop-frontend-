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
