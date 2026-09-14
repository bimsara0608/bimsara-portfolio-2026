import { ArrowLeft } from 'lucide-react';

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] relative z-10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24 w-full">
        {/* Back Nav skeleton */}
        <div className="inline-flex items-center gap-2 text-zinc-500 mb-12">
          <ArrowLeft size={18} className="opacity-40" />
          <div className="h-4 w-32 bg-white/[0.08] rounded-md animate-pulse" />
        </div>

        {/* Header skeleton */}
        <div className="mb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="h-7 w-28 bg-white/[0.08] rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-white/[0.05] rounded-full animate-pulse" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-6">
            <div className="h-10 sm:h-12 md:h-14 w-full max-w-3xl bg-white/[0.1] rounded-xl animate-pulse" />
            <div className="h-10 sm:h-12 md:h-14 w-2/3 max-w-xl bg-white/[0.07] rounded-xl animate-pulse" />
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-white/[0.08]">
            <div className="h-4 w-28 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-4 w-24 bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-4 w-32 bg-white/[0.06] rounded-md animate-pulse" />
          </div>
        </div>

        {/* Main Hero Media Skeleton */}
        <div className="mb-14 rounded-2xl overflow-hidden bg-[#111114] border border-white/[0.08] aspect-[16/10] max-h-[640px] w-full relative flex items-center justify-center animate-pulse">
          <div className="flex flex-col items-center gap-3 text-zinc-600">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center animate-pulse" />
            <div className="h-3 w-32 bg-white/[0.04] rounded-full" />
          </div>
        </div>

        {/* Two-column content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main article skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-6 w-48 bg-white/[0.08] rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/[0.05] rounded-md animate-pulse" />
              <div className="h-4 w-[92%] bg-white/[0.05] rounded-md animate-pulse" />
              <div className="h-4 w-[96%] bg-white/[0.05] rounded-md animate-pulse" />
              <div className="h-4 w-[85%] bg-white/[0.05] rounded-md animate-pulse" />
            </div>

            <div className="h-6 w-40 bg-white/[0.08] rounded-lg animate-pulse pt-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/[0.05] rounded-md animate-pulse" />
              <div className="h-4 w-[88%] bg-white/[0.05] rounded-md animate-pulse" />
            </div>
          </div>

          {/* Sidebar specs skeleton */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-5">
              <div className="h-5 w-36 bg-white/[0.08] rounded-md animate-pulse" />
              <div className="space-y-4 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="h-3.5 w-20 bg-white/[0.04] rounded" />
                    <div className="h-3.5 w-24 bg-white/[0.08] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
