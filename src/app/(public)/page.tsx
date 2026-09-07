import { createClient } from '@/utils/supabase/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { ContactSection } from '@/components/sections/ContactSection';
import type { Project, Profile } from '@/lib/types';

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const [{ data: profileData }, { data: projectsData }] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('date', { ascending: false }),
  ]);

  const profile: Profile = (profileData as Profile) || {
    id: '',
    name: 'Bimsara Gunawardana',
    title: 'Design Engineer',
    tagline: 'Design Engineer | Product Design, CAD, Robotics & 3D Visualization',
    bio: 'I’m a Design Engineer with a background in Instrumentation and Automation Technology from the University of Colombo, combining CAD, product design, robotics, automation, and 3D visualization to turn engineering concepts into functional products.',
    email: 'bimsaragunawardana3d@gmail.com',
    location: 'Colombo, Sri Lanka',
    stat_projects: '60+',
    stat_experience: '3+',
    stat_certification: 'CSWP',
    avatar_url: null,
  };

  const projects = (projectsData as Project[]) ?? [];

  return (
    <div className="flex flex-col">
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <ProjectsSection projects={projects} />
      <ServicesSection />
      <GitHubSection />
      <ContactSection />
    </div>
  );
}
