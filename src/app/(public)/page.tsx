import { createClient } from '@/utils/supabase/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { ContactSection } from '@/components/sections/ContactSection';
import {
  type Project,
  type Profile,
  type Education,
  type Experience,
  type Certification,
  MOCK_EDUCATION,
  MOCK_EXPERIENCES,
  MOCK_CERTIFICATIONS,
} from '@/lib/types';

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: profileData },
    { data: projectsData },
    { data: educationData },
    { data: experiencesData },
    { data: certificationsData },
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('date', { ascending: false }),
    supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('experiences')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('certifications')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ]);

  const profile: Profile = (profileData as Profile) || {
    id: '',
    name: 'Bimsara Gunawardana',
    title: 'Design Engineer',
    tagline: 'Design Engineer | Product Design, CAD, Robotics & 3D Visualization',
    bio: 'I’m Bimsara Gunawardana, a Design Engineer focused on mechanical design, manufacturing, automation, and product development. With a background in Engineering Technology, I work across CAD, robotics, embedded systems, and 3D printing to turn ideas into practical solutions.',
    email: 'bimsaragunawardana3d@gmail.com',
    location: 'Colombo, Sri Lanka',
    stat_projects: '60+',
    stat_experience: '3+',
    stat_certification: 'CSWP',
    avatar_url: null,
  };

  const projects = (projectsData as Project[]) ?? [];
  const education: Education[] =
    educationData && educationData.length > 0 ? (educationData as Education[]) : MOCK_EDUCATION;
  const experiences: Experience[] =
    experiencesData && experiencesData.length > 0
      ? (experiencesData as Experience[])
      : MOCK_EXPERIENCES;
  const certifications: Certification[] =
    certificationsData && certificationsData.length > 0
      ? (certificationsData as Certification[])
      : MOCK_CERTIFICATIONS;

  return (
    <div className="flex flex-col">
      <HeroSection profile={profile} />
      <div className="relative z-10 bg-[#09090b]/95 backdrop-blur-[4px] border-t border-white/[0.08] shadow-[0_-25px_60px_rgba(0,0,0,0.95)]">
        <AboutSection
          profile={profile}
          education={education}
          experiences={experiences}
          certifications={certifications}
        />
        <SkillsSection />
        <ProjectsSection projects={projects} />
        <ServicesSection />
        <GitHubSection />
        <ContactSection />
      </div>
    </div>
  );
}
