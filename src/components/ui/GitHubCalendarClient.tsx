'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GitHubCalendarClientProps {
  svgHtml: string;
}

export function GitHubCalendarClient({ svgHtml }: GitHubCalendarClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // On mobile / small screens, auto-scroll to the end (most recent contributions)
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }

    checkScroll();

    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollByAmount = (amount: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {/* Mobile scroll hints & quick nav buttons */}
      <div className="flex md:hidden items-center justify-between mb-3 text-[11px] font-mono text-zinc-400">
        <span className="inline-flex items-center gap-1 text-zinc-400">
          Swipe to explore history
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollByAmount(-220)}
            disabled={!canScrollLeft}
            aria-label="Scroll older commits"
            className="p-1 rounded bg-white/[0.05] border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(220)}
            disabled={!canScrollRight}
            aria-label="Scroll newer commits"
            className="p-1 rounded bg-white/[0.05] border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main scrollable area */}
      <div className="relative">
        {/* Left edge shadow when scrolled right */}
        {canScrollLeft && (
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#111114] to-transparent z-10 transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Right edge shadow when scrolled left */}
        {canScrollRight && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#111114] to-transparent z-10 transition-opacity"
            aria-hidden="true"
          />
        )}

        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="overflow-x-auto py-1 hide-scrollbar touch-pan-x overscroll-x-contain [&_svg]:min-w-[663px] [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:block"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>

      {/* Calendar Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400">
        <span className="hidden sm:inline">Updated automatically daily</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.08] inline-block" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0e4429] inline-block" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#006d32] inline-block" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#26a641] inline-block" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353] inline-block" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
