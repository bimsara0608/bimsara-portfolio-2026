'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Certification } from '@/lib/types';

interface CertificationsMarqueeProps {
  certifications: Certification[];
}

export function CertificationsMarquee({ certifications }: CertificationsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isInteractingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  // Ensure enough items to create a continuous infinite marquee loop
  const displayItems =
    certifications.length === 0
      ? []
      : certifications.length === 1
        ? [certifications[0], certifications[0], certifications[0], certifications[0]]
        : certifications.length < 4
          ? [...certifications, ...certifications, ...certifications]
          : [...certifications, ...certifications];

  // Auto-scroll loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el || displayItems.length === 0) return;

    let animId: number;
    const speed = 0.65; // smooth slow scroll speed

    const loop = () => {
      if (!isInteractingRef.current && el) {
        el.scrollLeft += speed;
        // Seamless loop wrapping when reaching halfway
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [displayItems.length]);

  const pauseScroll = useCallback(() => {
    isInteractingRef.current = true;
    setIsInteracting(true);
  }, []);

  const resumeScroll = useCallback(() => {
    isInteractingRef.current = false;
    setIsInteracting(false);
  }, []);

  // Mouse drag to scroll handlers for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    pauseScroll();
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStart(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      // Brief delay before resuming marquee after drag
      setTimeout(() => {
        resumeScroll();
      }, 1200);
    }
  };

  // Manual scroll controls
  const scrollStep = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    pauseScroll();
    const amount = direction === 'left' ? -340 : 340;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(() => {
      resumeScroll();
    }, 2000);
  };

  if (!certifications || certifications.length === 0) return null;

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
            aria-label="Scroll certifications left"
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scrollStep('right')}
            aria-label="Scroll certifications right"
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Marquee & Swipeable Container */}
      <div className="relative group overflow-hidden rounded-2xl">
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent z-10" />

        <div
          ref={containerRef}
          onMouseEnter={pauseScroll}
          onMouseLeave={() => {
            if (!isDragging) resumeScroll();
          }}
          onTouchStart={pauseScroll}
          onTouchEnd={() => {
            setTimeout(resumeScroll, 1500);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex gap-4 overflow-x-auto scrollbar-none py-1 px-4 cursor-grab active:cursor-grabbing select-none transition-all ${
            isInteracting ? '' : ''
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {displayItems.map((cert, idx) => (
            <div
              key={`${cert.id}-${idx}`}
              className="w-[290px] sm:w-[330px] flex-shrink-0 card p-5 border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between bg-[#111114] rounded-2xl"
            >
              <div>
                {/* Badge and Details */}
                <div className="flex items-start gap-3.5 mb-3">
                  {/* Digital Badge with crisp white background */}
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-sm">
                    {cert.badge_url ? (
                      <Image
                        src={cert.badge_url}
                        alt={cert.title}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Award size={22} className="text-zinc-800" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-sm leading-snug tracking-tight line-clamp-2">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-snug">{cert.issuer}</p>
                    <p className="text-xs text-zinc-400 font-mono mt-1">{cert.issue_date}</p>
                    {cert.credential_id && (
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Credential ID {cert.credential_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Skills tags */}
                {cert.skills && (
                  <p className="text-[11px] text-zinc-400 font-mono mb-3 line-clamp-1">
                    <span className="text-zinc-500">Skills:</span> {cert.skills}
                  </p>
                )}
              </div>

              {/* View credential link / button */}
              {cert.credential_url && (
                <div className="pt-2 border-t border-white/[0.06] mt-1">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // Prevent navigation if user was actively dragging
                      if (isDragging) e.preventDefault();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white transition-all shadow-sm"
                  >
                    <span>Show credential</span>
                    <ExternalLink size={11} className="text-zinc-400" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
