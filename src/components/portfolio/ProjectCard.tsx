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
      <div className="card overflow-hidden h-full flex flex-col bg-[#111114] border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 rounded-t-2xl">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <span className="text-zinc-700 text-5xl select-none font-mono font-medium">
                {project.title[0]}
              </span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-mono tracking-wider text-white/90 uppercase px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-base text-white leading-snug group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              {project.year && (
                <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] flex-shrink-0">
                  {project.year}
                </span>
              )}
            </div>
            {project.description && (
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Tools */}
          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                >
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.08]">
            <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
              Explore Case Study
            </span>
            <ArrowRight
              size={13}
              className="text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
