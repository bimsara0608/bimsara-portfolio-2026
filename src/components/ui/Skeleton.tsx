export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton bg-gray-200 dark:bg-gray-800 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div className="mb-6">
          <Skeleton className="w-24 h-6 rounded-full mb-6" />
          <Skeleton className="w-3/4 h-8 mb-3" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4" />
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
