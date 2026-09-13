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
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Build a base set with enough cards (at least 3-4) for smooth repetition
  const baseItems =
    certifications.length === 0
      ? []
      : certifications.length === 1
        ? [certifications[0], certifications[0], certifications[0], certifications[0]]
        : certifications.length === 2
          ? [certifications[0], certifications[1], certifications[0], certifications[1]]
          : certifications.length === 3
            ? [...certifications, ...certifications]
            : certifications;

  // Measure the pixel width of one complete set of cards
  useEffect(() => {
    const updateWidth = () => {
      if (setRef.current) {
        setSetWidth(setRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [baseItems.length]);

  // Set initial scroll position to setWidth (Set 2) so bi-directional scrolling is instant
  useEffect(() => {
    const el = containerRef.current;
    if (el && setWidth > 0 && el.scrollLeft === 0) {
      el.scrollLeft = setWidth;
    }
  }, [setWidth]);

  const pauseScroll = useCallback(() => {
    isPausedRef.current = true;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const resumeScrollWithDelay = useCallback((delayMs = 1500) => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      idleTimerRef.current = null;
    }, delayMs);
  }, []);

  // Continuous smooth auto-scroll loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el || setWidth <= 0) return;

    let animId: number;
    let lastTime: number | null = null;
    const speed = 36; // Constant smooth 36px/sec speed

    const loop = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isPausedRef.current && el && setWidth > 0) {
        el.scrollLeft += speed * delta;

        // Seamless infinite loop wrap
        if (el.scrollLeft >= setWidth * 3) {
          el.scrollLeft -= setWidth;
        } else if (el.scrollLeft <= setWidth * 0.5) {
          el.scrollLeft += setWidth;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [setWidth]);

  // Handle wrap on manual swipe/scroll as well
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || setWidth <= 0) return;

    // Wrap seamlessly within the buffer so user can scroll indefinitely in either direction
    if (el.scrollLeft >= setWidth * 3.5) {
      el.scrollLeft -= setWidth;
    } else if (el.scrollLeft <= setWidth * 0.4) {
      el.scrollLeft += setWidth;
    }
  };

  // Mouse drag to scroll handlers (desktop)
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
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsGrabbing(false);
      resumeScrollWithDelay(1800);
    }
  };

  // Chevron navigation buttons
  const scrollStep = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    pauseScroll();
    const amount = direction === 'left' ? -230 : 230;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    resumeScrollWithDelay(2200);
  };

  if (!certifications || certifications.length === 0) return null;

  const renderCard = (cert: Certification, key: string) => (
    <div
      key={key}
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
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium truncate">{cert.issuer}</p>

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
  );

  return (
    <div className="space-y-4">
      {/* Header with Title and manual chevron navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Award size={16} className="text-zinc-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            Licenses & Certifications
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scrollStep('left')}
            aria-label="Previous certification"
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scrollStep('right')}
            aria-label="Next certification"
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Marquee & Native Smooth Horizontal Scroll Container */}
      <div className="relative overflow-hidden rounded-2xl py-1">
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent z-10" />

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onMouseEnter={pauseScroll}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={pauseScroll}
          onTouchEnd={() => resumeScrollWithDelay(1500)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex overflow-x-auto scrollbar-none py-1 px-4 select-none touch-pan-x transition-colors ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Set 1 (for left-wrap buffer) */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set1-${idx}`))}
          </div>

          {/* Set 2 (measured set) */}
          <div ref={setRef} className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set2-${idx}`))}
          </div>

          {/* Set 3 */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set3-${idx}`))}
          </div>

          {/* Set 4 */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set4-${idx}`))}
          </div>

          {/* Set 5 */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set5-${idx}`))}
          </div>
        </div>
      </div>
    </div>
  );
}
