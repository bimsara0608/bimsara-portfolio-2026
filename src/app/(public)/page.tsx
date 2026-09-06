import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import type { Project, Profile, Testimonial } from '@/lib/types';

export default async function Home() {
  const supabase = await createClient();

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
    bio: 'I specialize in transforming complex engineering challenges into elegant, manufacturable designs.',
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
    '3D Printing',
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Fusion 360',
    'Product Design',
    'CAD',
  ];
  try {
    if (settingsData?.value) techStack = JSON.parse(settingsData.value);
  } catch {
    /* empty */
  }

  const parseStat = (stat: string) => {
    const match = stat.match(/^(\d+)(.*)$/);
    if (match) return { value: parseInt(match[1]), suffix: match[2] };
    return { value: parseInt(stat) || 0, suffix: '' };
  };

  const pStats = parseStat(profile.stat_projects || '60+');
  const eStats = parseStat(profile.stat_experience || '3+');

  return (
    <div className="flex flex-col">
      {/* ── MESH BACKGROUND ── */}
      <div className="mesh-bg" aria-hidden>
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* ── HERO ── */}
      <section className="w-full min-h-svh flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Badge */}
          <ScrollReveal direction="none" delay={0}>
            <div className="flex justify-center mb-7">
              <span className="hero-badge">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for freelance work
              </span>
            </div>
          </ScrollReveal>

          {/* Avatar */}
          {profile.avatar_url && (
            <ScrollReveal direction="up" delay={50}>
              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border border-border">
                <Image
                  src={profile.avatar_url}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </ScrollReveal>
          )}

          {/* Heading */}
          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-fluid-h1 font-bold mb-5 text-balance">
              Hi, I&apos;m{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-muted-foreground to-foreground">
                {profile.name.split(' ')[0]}
              </span>
            </h1>
          </ScrollReveal>

          {/* Tagline */}
          <ScrollReveal direction="up" delay={200}>
            <p className="text-fluid-p text-muted-foreground mb-10 text-balance max-w-2xl mx-auto">
              {profile.tagline}
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/projects" className="btn-glass btn-primary text-base px-7 py-3.5">
                View Work <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-glass btn-secondary text-base px-7 py-3.5">
                Get in Touch
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats - Reverted to classic minimalist look */}
          <ScrollReveal direction="up" delay={420}>
            <div className="mt-16 grid grid-cols-3 gap-6 md:gap-10 max-w-lg mx-auto">
              <div className="text-center">
                <AnimatedNumber
                  value={pStats.value}
                  suffix={pStats.suffix}
                  className="block text-4xl md:text-5xl font-bold mb-2 text-foreground"
                />
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  Projects
                </p>
              </div>
              <div className="text-center">
                <AnimatedNumber
                  value={eStats.value}
                  suffix={eStats.suffix}
                  className="block text-4xl md:text-5xl font-bold mb-2 text-foreground"
                />
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  Years Exp.
                </p>
              </div>
              <div className="text-center">
                <p className="block text-4xl md:text-5xl font-bold mb-2 text-foreground">
                  {profile.stat_certification}
                </p>
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  Certified
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TOOLS MARQUEE BAR ── */}
      <section className="w-full py-12 border-y border-border bg-muted/30 overflow-hidden relative flex items-center">
        {/* Gradients for fade effect on edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex w-[200%] gap-8 animate-[marquee_20s_linear_infinite]">
          {[...techStack, ...techStack].map((tool, i) => (
            <div
              key={`${tool}-${i}`}
              className="flex-shrink-0 text-xl font-bold text-muted-foreground/50 whitespace-nowrap"
            >
              {tool} <span className="mx-4 text-border">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="section-divider" />
                <h2 className="text-fluid-h2 font-bold">Selected Projects</h2>
                <p className="text-muted-foreground mt-2">A selection of recent work</p>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.id} direction="up" delay={idx * 100}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="glass-card p-16 text-center text-muted-foreground">
              <p className="font-medium">No featured projects yet. Add some in the admin panel!</p>
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up">
              <div className="mb-12">
                <div className="section-divider" />
                <h2 className="text-fluid-h2 font-bold">Client Feedback</h2>
              </div>
              <TestimonialCarousel testimonials={testimonials} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── CTA STRIP ── */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="glass-card p-12 md:p-16 text-center">
              <h2 className="text-fluid-h2 font-bold mb-4">Let&apos;s build something together</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Have a project in mind? I&apos;d love to hear about it.
              </p>
              <Link href="/contact" className="btn-glass btn-primary text-base px-8 py-4">
                Start a Conversation <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
