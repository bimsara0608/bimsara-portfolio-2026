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
    <section id="projects" className="w-full py-24 md:py-32 px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/80 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                SELECTED WORK
              </span>
              <h2 className="text-fluid-h2 text-white tracking-tight mb-3">
                Featured Engineering &amp; CAD Projects.
              </h2>
              <p className="text-[15px] text-zinc-400 leading-relaxed max-w-xl">
                Parametric mechanical assemblies, robotics mechanisms, injection-molded enclosures,
                and photorealistic visualizations engineered for real-world production.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              All Projects ({projects.length}) <ArrowRight size={13} />
            </Link>
          </div>

          {/* Category pills */}
          {categories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-10 hide-scrollbar">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`/projects${cat !== 'All' ? `?category=${encodeURIComponent(cat)}` : ''}`}
                  className="whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-[#111114] text-zinc-300 hover:text-white hover:border-white/25 transition-all shadow-sm"
                >
                  {cat}
                </a>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:gap-8 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 md:grid-cols-2 hide-scrollbar">
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-w-[85vw] sm:min-w-[70vw] md:min-w-0 snap-center md:snap-align-none shrink-0 md:shrink h-full"
              >
                <ProjectCard project={project} />
              </div>
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
      </div>
    </section>
  );
}
