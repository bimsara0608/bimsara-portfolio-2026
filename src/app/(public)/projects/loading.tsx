import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] relative z-10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
        <div className="h-4 w-28 bg-white/10 rounded-md mb-8 animate-pulse" />

        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
          role="status"
          aria-label="Loading content"
        >
          <div className="space-y-3">
            <div className="h-3.5 w-28 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 sm:h-12 w-64 bg-white/15 rounded-xl animate-pulse" />
          </div>
          <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-white/10 rounded-full flex-shrink-0 animate-pulse"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {[...Array(4)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
