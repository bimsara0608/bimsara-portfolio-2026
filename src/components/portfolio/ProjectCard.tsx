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
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <div className="glass-card overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted rounded-t-[20px]">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-4xl font-bold opacity-30">
                {project.title[0]}
              </span>
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 project-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category pill */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-3 py-1.5 text-xs font-semibold text-white rounded-full backdrop-blur-md bg-black/30 border border-white/20">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground leading-snug group-hover:opacity-80 transition-opacity mb-1">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {project.category}
              {project.year && <span className="ml-2 opacity-60">· {project.year}</span>}
            </p>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {project.description}
              </p>
            )}
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

          {/* Footer link */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              View Project
            </span>
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-200">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
