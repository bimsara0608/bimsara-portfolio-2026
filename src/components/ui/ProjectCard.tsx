import Image from "next/image";
import Link from "next/link";
import { PillBadge } from "./PillBadge";

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  slug: string;
}

export function ProjectCard({ title, category, year, imageUrl, slug }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div className="card overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <div className="flex gap-2 items-center">
            <PillBadge label={category} />
            <span className="text-muted text-sm font-medium">{year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
