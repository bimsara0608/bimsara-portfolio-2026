'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import type { Certification } from '@/lib/types';

interface CertificationsMarqueeProps {
  certifications: Certification[];
}

export function CertificationsMarquee({ certifications }: CertificationsMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);

  // Build a base set with enough cards (at least 4) to ensure continuous coverage
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

  // Measure the pixel width of one complete set of cards including gap
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

  // Infinite seamless marquee auto-scroll loop
  useAnimationFrame((_time, delta) => {
    if (isHovered || isDragging || setWidth <= 0) return;

    // Smooth ~40px per second velocity
    const moveBy = (40 * delta) / 1000;
    let currentX = x.get() - moveBy;

    // Seamlessly wrap position
    if (currentX <= -setWidth) {
      currentX += setWidth;
    } else if (currentX > 0) {
      currentX -= setWidth;
    }

    x.set(currentX);
  });

  const handleDrag = () => {
    if (setWidth <= 0) return;
    let currentX = x.get();
    while (currentX <= -setWidth) {
      currentX += setWidth;
    }
    while (currentX > 0) {
      currentX -= setWidth;
    }
    x.set(currentX);
  };

  const scrollStep = (direction: 'left' | 'right') => {
    if (setWidth <= 0) return;
    const step = 280;
    let newX = direction === 'left' ? x.get() + step : x.get() - step;
    while (newX <= -setWidth) {
      newX += setWidth;
    }
    while (newX > 0) {
      newX -= setWidth;
    }
    x.set(newX);
  };

  if (!certifications || certifications.length === 0) return null;

  const renderCard = (cert: Certification, key: string) => (
    <div
      key={key}
      className="w-[240px] sm:w-[265px] flex-shrink-0 card overflow-hidden border-white/[0.08] hover:border-white/25 transition-all shadow-xl bg-[#111114] rounded-2xl select-none flex flex-col justify-between"
    >
      {/* Top: Digital Badge Showcase Window with White Backing */}
      <div className="w-full h-36 sm:h-40 relative bg-white flex items-center justify-center p-4 overflow-hidden border-b border-white/[0.08]">
        {cert.badge_url ? (
          <Image
            src={cert.badge_url}
            alt={cert.title}
            width={120}
            height={120}
            className="object-contain max-h-full max-w-full pointer-events-none drop-shadow-sm"
          />
        ) : (
          <Award size={48} className="text-zinc-800" />
        )}
      </div>

      {/* Bottom: Info Section structured like Profile Card (Image 2) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#111114]">
        <div>
          <h4 className="font-semibold text-white text-sm leading-snug tracking-tight line-clamp-2">
            {cert.title}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 font-medium">{cert.issuer}</p>

          <div className="h-px bg-white/[0.08] my-2.5" />

          <div className="space-y-1 text-xs text-zinc-400 font-mono">
            <div>{cert.issue_date}</div>
            {cert.credential_id && (
              <div className="text-[11px] text-zinc-500 font-mono truncate">
                ID: {cert.credential_id}
              </div>
            )}
          </div>

          {cert.skills && (
            <p className="text-[11px] text-zinc-400 font-mono mt-2 line-clamp-1">
              <span className="text-zinc-500">Skills:</span> {cert.skills}
            </p>
          )}
        </div>

        {cert.credential_url && (
          <a
            href={cert.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isDragging) e.preventDefault();
            }}
            className="w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-all text-xs font-mono tracking-wider uppercase shadow-sm cursor-pointer mt-1"
          >
            <ExternalLink size={12} />
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

      {/* Marquee & Swipe Track */}
      <div
        className="relative overflow-hidden rounded-2xl py-1 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 1500)}
      >
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent z-10" />

        <motion.div
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
            handleDrag();
          }}
          className="flex w-max"
        >
          {/* Set 1 (measured for wrap width) */}
          <div ref={setRef} className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set1-${idx}`))}
          </div>

          {/* Set 2 (seamless continuation) */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set2-${idx}`))}
          </div>

          {/* Set 3 (buffer for wide screens & drag) */}
          <div className="flex gap-4 pr-4">
            {baseItems.map((cert, idx) => renderCard(cert, `set3-${idx}`))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
