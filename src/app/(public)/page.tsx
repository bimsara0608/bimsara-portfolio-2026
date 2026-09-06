import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { TechStackMarquee } from '@/components/ui/TechStackMarquee';
import type { Project, Profile, Testimonial } from '@/lib/types';

export default async function Home() {
  const supabase = await createClient();

  // Fetch data in parallel
  const [
    { data: profileData },
    { data: featuredProjects },
    { data: testimonialsData },
    { data: settingsData },
  ] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .order('date', { ascending: false })
      .limit(4),
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase.from('site_settings').select('*').eq('key', 'tech_stack').single(),
  ]);

  const profile = (profileData as Profile) || {
    name: 'Bimsara Gunawardana',
    tagline: 'Design Engineer | Product Design & 3D Animation',
    bio: 'I specialize in transforming complex engineering challenges into elegant, manufacturable designs. With expertise in SolidWorks and Blender, I bridge the gap between technical precision and visual storytelling.',
    stat_projects: '60+',
    stat_experience: '3+',
    stat_certification: 'CSWP',
    avatar_url: null,
  };

  const projects = (featuredProjects as Project[]) ?? [];
  const testimonials = (testimonialsData as Testimonial[]) ?? [];

  let techStack: string[] = [
    'SolidWorks',
    'Blender 3D',
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
  ];
  try {
    if (settingsData && settingsData.value) {
      techStack = JSON.parse(settingsData.value);
    }
  } catch {}

  // Parse stats (e.g. "60+" -> 60 and "+")
  const parseStat = (stat: string) => {
    const match = stat.match(/^(\d+)(.*)$/);
    if (match) return { value: parseInt(match[1]), suffix: match[2] };
    return { value: parseInt(stat) || 0, suffix: '' };
  };

  const pStats = parseStat(profile.stat_projects || '60+');
  const eStats = parseStat(profile.stat_experience || '3+');

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muted/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[128px] opacity-50 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-border/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[128px] opacity-50 animate-blob animation-delay-2000" />

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <ScrollReveal direction="up" delay={0}>
            {profile.avatar_url && (
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <Image
                  src={profile.avatar_url}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}
            <h1 className="text-fluid-h1 font-black mb-6 text-balance">
              Hi, I&apos;m{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                {profile.name.split(' ')[0]}
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <p className="text-fluid-p font-medium text-muted-foreground mb-10 text-balance max-w-3xl mx-auto">
              {profile.tagline}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/projects"
                className="magnetic bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                View Work <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="magnetic bg-transparent text-foreground border-2 border-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={450}>
            <div className="mt-20 grid grid-cols-3 gap-4 md:gap-12 max-w-3xl mx-auto pt-12 border-t border-border">
              <div className="text-center">
                <AnimatedNumber
                  value={pStats.value}
                  suffix={pStats.suffix}
                  className="block text-4xl md:text-5xl font-black mb-1"
                />
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Projects
                </p>
              </div>
              <div className="text-center border-x border-border">
                <AnimatedNumber
                  value={eStats.value}
                  suffix={eStats.suffix}
                  className="block text-4xl md:text-5xl font-black mb-1"
                />
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Years Exp.
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black mb-1">{profile.stat_certification}</p>
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Certified
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <TechStackMarquee stack={techStack} />

      {/* Featured Projects Section */}
      <section className="w-full bg-background py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="left">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">
                  /01 Featured Work
                </h2>
                <h3 className="text-fluid-h2 font-bold">Selected Projects</h3>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-2 font-bold hover:text-muted-foreground transition-colors magnetic"
              >
                View all projects <ArrowRight size={20} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.id} direction="up" delay={idx * 150}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
              <p>No featured projects yet. Add some in the admin panel!</p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-bold hover:text-muted-foreground transition-colors"
            >
              View all projects <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="w-full bg-background py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-16 text-center">
                /02 Client Feedback
              </h2>
              <TestimonialCarousel testimonials={testimonials} />
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
