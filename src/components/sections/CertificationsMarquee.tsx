'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Certification } from '@/lib/types';

interface CertificationsMarqueeProps {
  certifications: Certification[];
}

export function CertificationsMarquee({ certifications }: CertificationsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(30);
  const [canScroll, setCanScroll] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate scroll metrics (progress ratio and thumb width)
  const updateScrollMetrics = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 2) {
      setCanScroll(true);
      const ratio = Math.min(Math.max(el.scrollLeft / maxScroll, 0), 1);
      setScrollProgress(ratio);

      // Thumb width proportional to viewport visibility (clamped between 20% and 75%)
      const visibleRatio = el.clientWidth / el.scrollWidth;
      const thumb = Math.min(Math.max(visibleRatio * 100, 20), 75);
      setThumbWidthPercent(thumb);
    } else {
      setCanScroll(false);
      setScrollProgress(0);
      setThumbWidthPercent(100);
    }
  }, []);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => window.removeEventListener('resize', updateScrollMetrics);
  }, [certifications.length, updateScrollMetrics]);

  const pauseScroll = useCallback(() => {
    isPausedRef.current = true;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const resumeScrollWithDelay = useCallback((delayMs = 2500) => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      idleTimerRef.current = null;
    }, delayMs);
  }, []);

  // Gentle auto-scroll that naturally stops at the end
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    let lastTime: number | null = null;
    const speed = 25; // Gentle 25px/sec

    const loop = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isPausedRef.current && el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 2 && el.scrollLeft < maxScroll - 1) {
          el.scrollLeft += speed * delta;
          updateScrollMetrics();
        } else if (el.scrollLeft >= maxScroll - 1) {
          // Reached end, stop naturally
          isPausedRef.current = true;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [updateScrollMetrics]);

  // Handle scroll events
  const handleScroll = () => {
    updateScrollMetrics();
  };

  // Mouse drag-to-scroll handlers (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    pauseScroll();
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    setIsGrabbing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.25;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    updateScrollMetrics();
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsGrabbing(false);
      resumeScrollWithDelay(3000);
    }
  };

  // Chevron step buttons
  const scrollStep = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    pauseScroll();
    const amount = direction === 'left' ? -230 : 230;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    resumeScrollWithDelay(3500);
  };

  if (!certifications || certifications.length === 0) return null;

  // Thumb offset translation in percentage
  const thumbTranslateX = scrollProgress * (100 - thumbWidthPercent);

  return (
    <div className="space-y-3.5">
      {/* Header with Title and manual chevron navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Award size={16} className="text-zinc-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            Licenses & Certifications
          </h3>
        </div>

        {canScroll && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollStep('left')}
              disabled={scrollProgress <= 0.01}
              aria-label="Previous certification"
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scrollStep('right')}
              disabled={scrollProgress >= 0.99}
              aria-label="Next certification"
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Cards Bar */}
      <div className="relative overflow-hidden rounded-2xl py-1">
        {/* Subtle dynamic edge gradient fades (only visible when scrollable in that direction) */}
        {scrollProgress > 0.02 && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-10 transition-opacity duration-200" />
        )}
        {scrollProgress < 0.98 && canScroll && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent z-10 transition-opacity duration-200" />
        )}

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onMouseEnter={pauseScroll}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={pauseScroll}
          onTouchEnd={() => resumeScrollWithDelay(2500)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex gap-4 overflow-x-auto scrollbar-none py-1 px-1 select-none touch-pan-x scroll-smooth transition-colors ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="w-[195px] sm:w-[215px] flex-shrink-0 card overflow-hidden border-white/[0.08] hover:border-white/20 transition-all shadow-md bg-[#111114] rounded-xl select-none flex flex-col justify-between"
            >
              {/* Top: Compact Digital Badge Showcase Window with White Backing */}
              <div className="w-full h-24 sm:h-28 relative bg-white flex items-center justify-center p-3 overflow-hidden border-b border-white/[0.08]">
                {cert.badge_url ? (
                  <Image
                    src={cert.badge_url}
                    alt={cert.title}
                    width={72}
                    height={72}
                    className="object-contain max-h-full max-w-full pointer-events-none drop-shadow-sm"
                  />
                ) : (
                  <Award size={32} className="text-zinc-800" />
                )}
              </div>

              {/* Bottom: Compact Information Section */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2 bg-[#111114]">
                <div>
                  <h4 className="font-semibold text-white text-xs leading-snug tracking-tight line-clamp-2">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-medium truncate">
                    {cert.issuer}
                  </p>

                  <div className="h-px bg-white/[0.08] my-2" />

                  <div className="space-y-0.5 text-[10px] text-zinc-400 font-mono">
                    <div>{cert.issue_date}</div>
                    {cert.credential_id && (
                      <div className="text-[9.5px] text-zinc-500 font-mono truncate">
                        ID: {cert.credential_id}
                      </div>
                    )}
                  </div>
                </div>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (hasMovedRef.current) e.preventDefault();
                    }}
                    className="w-full bg-white text-black font-semibold py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-zinc-200 transition-all text-[10px] font-mono tracking-wider uppercase shadow-sm cursor-pointer mt-1"
                  >
                    <ExternalLink size={10} />
                    <span>SHOW CREDENTIAL</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tiny UI matching horizontal scroll progress indicator */}
      {canScroll && (
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Slim progress track */}
          <div className="w-24 sm:w-32 h-1 bg-white/[0.08] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-white/80 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-all duration-150 ease-out"
              style={{
                width: `${thumbWidthPercent}%`,
                transform: `translateX(${thumbTranslateX * (100 / thumbWidthPercent)}%)`,
              }}
            />
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            {certifications.length} {certifications.length === 1 ? 'Credential' : 'Credentials'}
          </span>
        </div>
      )}
    </div>
  );
}
