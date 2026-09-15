import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import type { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Feature around 2 projects on the homepage (prioritizing projects marked as featured)
  const featured = projects.filter((p) => p.featured);
  const displayProjects = (featured.length > 0 ? featured : projects).slice(0, 2);

  return (
    <section
      id="projects"
      className="w-full pt-12 md:pt-16 pb-16 md:pb-20 px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium tracking-widest uppercase text-white/80 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                FEATURED WORK
              </span>
              <h2 className="text-fluid-h2 text-white tracking-tight mb-3">
                Featured Engineering &amp; CAD Projects.
              </h2>
              <p className="text-[15px] text-zinc-400 leading-relaxed max-w-xl text-justify">
                Parametric mechanical assemblies, robotics mechanisms, injection-molded enclosures,
                and photorealistic visualizations engineered for real-world production.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-all flex-shrink-0 group"
            >
              <span>View All Projects</span>
              <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-400 group-hover:text-white">
                {projects.length}
              </span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid - Exactly 2 Featured Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {displayProjects.length === 0 && (
            <div className="card p-16 text-center text-muted-foreground">
              <p className="text-[15px]">No featured projects yet. Add some in the admin panel!</p>
            </div>
          )}

          {/* Bottom View All Projects Button - Bold and visible on BOTH desktop and mobile */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-sm font-semibold text-white transition-all shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md group w-full sm:w-auto"
            >
              <span>View All Projects</span>
              <span className="text-xs font-mono text-zinc-400 group-hover:text-white px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/10">
                {projects.length} Total
              </span>
              <ArrowRight
                size={16}
                className="text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
