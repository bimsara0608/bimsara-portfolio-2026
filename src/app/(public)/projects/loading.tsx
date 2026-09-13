import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

export default function ProjectsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div
        className="flex justify-between items-end mb-16"
        role="status"
        aria-label="Loading content"
      >
        <div className="space-y-3">
          <div className="h-4 w-28 bg-white/10 rounded-full animate-pulse" />
          <div className="h-12 w-64 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0 animate-pulse"
          />
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
