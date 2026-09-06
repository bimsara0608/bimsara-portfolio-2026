import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

function getHeroImage(images: Project['project_images']): string | null {
  if (!images || images.length === 0) return null;
  return images.find((i) => i.is_hero)?.url ?? images[0]?.url ?? null;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const heroUrl = getHeroImage(project.project_images ?? []);

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-103"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-4xl font-bold opacity-30">
                {project.title[0]}
              </span>
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 project-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category pill — top right */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="glass-card px-3 py-1.5 text-xs font-semibold text-white rounded-full backdrop-blur-md bg-black/30 border border-white/20">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-snug group-hover:opacity-80 transition-opacity">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {project.category}
                {project.year && <span className="ml-2 opacity-60">· {project.year}</span>}
              </p>
            </div>
            {/* Arrow icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Tools */}
          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tools.slice(0, 3).map((tool) => (
                <span key={tool} className="pill">
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="pill">+{project.tools.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
