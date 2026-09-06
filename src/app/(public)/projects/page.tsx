import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import type { Project } from '@/lib/types';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata = {
  title: 'Projects | Bimsara Gunawardana',
  description: 'Browse my portfolio of 3D models, CAD designs, and engineering projects.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const sp = await searchParams;
  const currentCategory = sp.category || 'All';

  // Fetch projects
  let query = supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_published', true)
    .order('date', { ascending: false });

  if (currentCategory !== 'All') {
    query = query.eq('category', currentCategory);
  }

  const { data: projectsData } = await query;
  const projects = (projectsData as Project[]) ?? [];

  // Fetch unique categories
  const { data: allProjects } = await supabase
    .from('projects')
    .select('category')
    .eq('is_published', true);
  const categories = [
    'All',
    ...Array.from(new Set((allProjects ?? []).map((p) => p.category))),
  ].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
      <ScrollReveal direction="left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">
              /02 Portfolio
            </h2>
            <h1 className="text-fluid-h2 font-bold">All Projects</h1>
          </div>
          <p className="text-muted-foreground font-medium text-lg">
            Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Tabs */}
      <ScrollReveal direction="up" delay={150}>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar">
          {categories.map((cat) => (
            <a
              key={cat}
              href={cat === 'All' ? '/projects' : `/projects?category=${encodeURIComponent(cat)}`}
              className={`magnetic whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                currentCategory === cat
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project, idx) => (
          <ScrollReveal key={project.id} direction="up" delay={(idx % 4) * 100}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-card text-center py-16 text-muted-foreground mt-8">
          <p className="text-lg font-medium">No projects found in this category.</p>
          <Link
            href="/projects"
            className="text-foreground font-semibold mt-4 inline-block hover:opacity-70 transition-opacity"
          >
            View all projects
          </Link>
        </div>
      )}
    </div>
  );
}
