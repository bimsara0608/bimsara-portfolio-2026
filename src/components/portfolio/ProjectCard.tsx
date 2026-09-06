import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted rounded-t-2xl">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-5xl opacity-20 select-none font-medium">
                {project.title[0]}
              </span>
            </div>
          )}
          {/* Category badge — always visible, top left */}
          <div className="absolute top-3 left-3">
            <span className="pill bg-background/80 backdrop-blur-sm border-border/40 text-foreground">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-medium text-base text-foreground leading-snug mb-1 group-hover:text-muted-foreground transition-colors">
              {project.title}
            </h3>
            {project.year && <p className="text-xs text-muted-foreground">{project.year}</p>}
            {project.description && (
              <p className="text-sm text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
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

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              View Project
            </span>
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
