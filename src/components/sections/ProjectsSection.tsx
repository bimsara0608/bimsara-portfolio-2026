import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import type { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category))).sort()];

  return (
    <section id="projects" className="w-full py-24 md:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heavy dark frosted glass backdrop */}
        <div className="rounded-[24px] bg-black/90 backdrop-blur-3xl border border-white/5 p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white mb-6">
                Work
              </span>
              <h2 className="text-fluid-h2 text-white tracking-tight">
                Selected Projects.{' '}
                <span className="text-muted-foreground">What I&apos;ve built.</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {/* Category pills */}
          {categories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-10 hide-scrollbar">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`/projects${cat !== 'All' ? `?category=${encodeURIComponent(cat)}` : ''}`}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="card p-16 text-center text-muted-foreground">
              <p className="text-[15px]">No featured projects yet. Add some in the admin panel!</p>
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all projects <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        {/* end frosted glass */}
      </div>
    </section>
  );
}
