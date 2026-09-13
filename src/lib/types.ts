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

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  period?: string;
  grade?: string;
  activities?: string;
  description?: string;
  logo_url?: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const MOCK_EDUCATION: Education[] = [
  {
    id: 'mock-uoc',
    institution: 'University of Colombo',
    degree: 'Bachelor of engineering technology honours in instrumentation and automation',
    field_of_study: 'Mechatronics, Robotics, and Automation Engineering',
    period: 'Jun 2022 – Jun 2026',
    activities: '',
    description: '',
    logo_url: '/images/education/colombo.png',
    sort_order: 0,
    is_published: true,
  },
  {
    id: 'mock-nalanda',
    institution: 'Nalanda College Colombo',
    degree: '',
    field_of_study: '',
    period: '',
    activities: 'Activities and societies: Vice President, Aeronautical Society',
    description: '',
    logo_url: '/images/education/nalanda.png',
    sort_order: 1,
    is_published: true,
  },
];

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  desc: string;
  active?: boolean;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Design Engineer',
    company: 'Freelance',
    period: '2023 – Present',
    desc: 'Specializing in end-to-end product design, parametric SolidWorks CAD, mechanical assemblies, and photorealistic 3D visualization for international clients.',
    active: true,
    sort_order: 0,
    is_published: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Autonomation Engineering Intern',
    company: 'MAS Bodyline / MAS Holdings',
    period: 'Process Innovation',
    desc: 'Engineering projects spanning Zig-Zag auto feeder development, PLC programming, HMI interface design, AGV troubleshooting, yarn break detection, PCB design, CAD modeling, and rapid physical prototyping.',
    active: false,
    sort_order: 1,
    is_published: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Concept & 3D Designer',
    company: 'Lautus Robotics',
    period: 'Robotics & Automation',
    desc: 'Developed concept designs and 3D CAD models and participated in manufacturing and assembly of an AGV for the Civil Aviation Authority of Sri Lanka.',
    active: false,
    sort_order: 2,
    is_published: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Co-Founder & Lead 3D Designer',
    company: 'VirtualPensar Pvt Ltd',
    period: 'Design & Visualization',
    desc: 'Led 3D design and prototyping, delivering 60+ engineering projects including functional prototypes and 3D-printable components.',
    active: false,
    sort_order: 3,
    is_published: true,
  },
];

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
  badge_url?: string;
  skills?: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const MOCK_CERTIFICATIONS: Certification[] = [
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Certified SOLIDWORKS Professional (CSWP)',
    issuer: 'Dassault Systèmes',
    issue_date: 'Issued May 2026',
    credential_id: 'C-29RCXDMEHU',
    credential_url: 'https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-29RCXDMEHU',
    badge_url: '/images/certifications/cswp.png',
    skills: '3D Modeling, Computer-Aided Design (CAD), Parametric Modeling',
    sort_order: 0,
    is_published: true,
  },
];
