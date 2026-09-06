import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Project, Profile, Testimonial } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  // Fetch data in parallel
  const [
    { data: profileData },
    { data: featuredProjects },
    { data: testimonialsData }
  ] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("projects")
      .select("*, project_images(*)")
      .eq("is_published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .order("date", { ascending: false })
      .limit(4),
    supabase.from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
  ]);

  const profile = (profileData as Profile) || {
    name: "Bimsara Gunawardana",
    tagline: "Design Engineer | Product Design & 3D Animation",
    bio: "I specialize in transforming complex engineering challenges into elegant, manufacturable designs. With expertise in SolidWorks and Blender, I bridge the gap between technical precision and visual storytelling.",
    stat_projects: "60+",
    stat_experience: "3+",
    stat_certification: "CSWP",
    avatar_url: null,
  };

  const projects = (featuredProjects as Project[]) ?? [];
  const testimonials = (testimonialsData as Testimonial[]) ?? [];

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[128px] opacity-50 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-300 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[128px] opacity-50 animate-blob animation-delay-2000" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up" delay={0}>
            {profile.avatar_url && (
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
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
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-balance leading-[1.1]">
              Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">{profile.name.split(" ")[0]}</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <p className="text-xl md:text-3xl font-medium text-muted mb-10 text-balance max-w-3xl mx-auto leading-relaxed">
              {profile.tagline}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/projects"
                className="bg-accent dark:bg-white text-white dark:text-accent px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                View Work <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-accent dark:text-white border-2 border-accent dark:border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-white dark:hover:bg-white dark:hover:text-accent transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={450}>
            <div className="mt-20 grid grid-cols-3 gap-4 md:gap-12 max-w-3xl mx-auto pt-12 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black mb-1">{profile.stat_projects}</p>
                <p className="text-sm font-bold text-muted uppercase tracking-widest">Projects</p>
              </div>
              <div className="text-center border-l border-r border-gray-200 dark:border-gray-800">
                <p className="text-4xl md:text-5xl font-black mb-1">{profile.stat_experience}</p>
                <p className="text-sm font-bold text-muted uppercase tracking-widest">Years Exp.</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black mb-1">{profile.stat_certification}</p>
                <p className="text-sm font-bold text-muted uppercase tracking-widest">Certified</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="w-full bg-white dark:bg-black py-32 px-4 sm:px-6 lg:px-8 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="left">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Featured Work</h2>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Selected Projects</h3>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-2 font-bold hover:text-muted transition-colors"
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
            <div className="text-center py-20 text-muted border border-dashed border-gray-300 dark:border-gray-800">
              <p>No featured projects yet. Add some in the admin panel!</p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-bold hover:text-muted transition-colors"
            >
              View all projects <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="w-full py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-16 text-center">/02 Client Feedback</h2>
              <TestimonialCarousel testimonials={testimonials} />
            </ScrollReveal>
          </div>
        </section>
      )}

    </div>
  );
}
