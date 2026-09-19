import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCachedProjects } from '@/lib/data';
import { ProjectCard } from '@/components/portfolio/ProjectCard';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bimsara-portfolio-2026.vercel.app';
const PAGE_SIZE = 16;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = sp.category || 'All';

  const isFiltered = category !== 'All';
  let title = isFiltered
    ? `${category} CAD & Design Projects | Bimsara Gunawardana`
    : 'Parametric CAD & Design Projects | Bimsara Gunawardana';
  if (title.length > 60) {
    title = isFiltered
      ? `${category} Projects | Bimsara Gunawardana`
      : 'All CAD Projects | Bimsara Gunawardana';
  }
  const description = isFiltered
    ? `Browse Bimsara Gunawardana's ${category} portfolio — CAD designs, 3D models, and engineering projects.`
    : 'Browse the full portfolio of Bimsara Gunawardana — parametric CAD designs, 3D models, robotics, and engineering projects.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/projects`,
    },
  };
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const currentCategory = sp.category || 'All';
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  // Fetch from cached data store (0ms round-trip when cached)
  const allProjects = await getCachedProjects();

  // Extract available unique categories
  const categories = [
    'All',
    ...Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean))),
  ].sort();

  // Filter by category
  const filteredProjects =
    currentCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === currentCategory);

  const totalProjects = filteredProjects.length;
  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  // Paginate list to avoid excessive DOM nodes and optimize paint times
  const projects = filteredProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Dynamic H1 label
  const pageHeading = currentCategory === 'All' ? 'All Projects' : `${currentCategory} Projects`;

  const buildCategoryUrl = (cat: string) => {
    return cat === 'All' ? '/projects' : `/projects?category=${encodeURIComponent(cat)}`;
  };

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (currentCategory !== 'All') params.set('category', currentCategory);
    if (pageNum > 1) params.set('page', pageNum.toString());
    const qs = params.toString();
    return qs ? `/projects?${qs}` : '/projects';
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative z-10 text-foreground">
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
              {pageHeading}
            </h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Showing {filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildCategoryUrl(cat)}
              rel="nofollow"
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
            <Link
              href={buildPageUrl(currentPage - 1)}
              aria-disabled={currentPage <= 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                currentPage <= 1
                  ? 'opacity-40 pointer-events-none border-white/10 text-zinc-500'
                  : 'border-white/15 bg-white/[0.04] text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft size={14} /> Previous
            </Link>

            <span className="text-xs font-mono text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>

            <Link
              href={buildPageUrl(currentPage + 1)}
              aria-disabled={currentPage >= totalPages}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                currentPage >= totalPages
                  ? 'opacity-40 pointer-events-none border-white/10 text-zinc-500'
                  : 'border-white/15 bg-white/[0.04] text-white hover:bg-white/10'
              }`}
            >
              Next <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
