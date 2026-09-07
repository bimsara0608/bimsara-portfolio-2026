import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import type { Project } from '@/lib/types';

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
      {/* Back to Home Nav */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-8 transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
            Portfolio Archive
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            All Projects
          </h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === 'All' ? '/projects' : `/projects?category=${encodeURIComponent(cat)}`}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              currentCategory === cat
                ? 'bg-foreground text-background border-foreground'
                : 'bg-secondary/40 text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-border text-center py-16 text-muted-foreground mt-8">
          <p className="text-sm font-medium">No projects found in this category.</p>
          <Link
            href="/projects"
            className="text-foreground text-xs font-semibold mt-3 inline-block hover:underline"
          >
            View all projects
          </Link>
        </div>
      )}
    </div>
  );
}
