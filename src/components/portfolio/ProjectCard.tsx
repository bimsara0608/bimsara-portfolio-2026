import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { PillBadge } from "@/components/ui/PillBadge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const heroImage = project.project_images?.find((img) => img.is_hero) || project.project_images?.[0];

  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <div className="card overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-accent/30 dark:hover:border-white/30 transition-colors">
        
        {/* Image Container */}
        <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-950">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700 font-medium">
              No Image
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex gap-2 mb-4 flex-wrap">
            <PillBadge label={project.category} />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 group-hover:text-accent dark:group-hover:text-white transition-colors">
            {project.title}
          </h3>
          
          <p className="text-muted line-clamp-2 mb-6 flex-1">
            {project.description || "No description provided."}
          </p>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800 font-bold text-sm uppercase tracking-wider">
            <span className="text-muted group-hover:text-foreground dark:group-hover:text-white transition-colors">
              View Case Study
            </span>
            <ArrowRight size={18} className="text-accent dark:text-white transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
