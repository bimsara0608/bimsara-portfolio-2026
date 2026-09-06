// src/lib/types.ts
// Strict TypeScript interfaces for the entire portfolio system

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  is_hero: boolean;
  sort_order: number;
  alt_text?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  year?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  tools?: string[];
  timeline?: string;
  client?: string;
  external_url?: string;
  model_url?: string;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  project_images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  budget?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  title?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  grabcad_url?: string;
  resume_url?: string;
  avatar_url?: string;
  stat_projects?: string;
  stat_experience?: string;
  stat_certification?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title?: string;
  client_company?: string;
  client_avatar_url?: string;
  content: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | boolean | string[];
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
}
