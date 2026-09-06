import { ProjectCardSkeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/02 Portfolio</h2>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">All Projects</h1>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0 animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {[...Array(6)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
