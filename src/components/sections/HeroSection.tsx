'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Profile } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Ascending animated counter for factual engineering numbers with smooth cubic ease-out
function AscendingCounter({
  target,
  suffix = '',
  delay = 500,
}: {
  target: number;
  suffix?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTimestamp: number | null = null;
    const duration = 1400;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Smooth cubic ease-out: gentle, silky deceleration instead of sudden blur
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      frameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [target, delay]);

  return (
    <span className="tabular-nums inline-block">
      {count}
      {suffix}
    </span>
  );
}

export function HeroSection({ profile }: HeroSectionProps) {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="w-full min-h-[100svh] flex flex-col justify-center pt-20 sm:pt-24 pb-16 relative overflow-hidden"
    >
      {/* Left protective gradient scrim - Smooth fade, no sharp seams */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[56%] lg:w-[52%] pointer-events-none bg-gradient-to-r from-background via-background/90 via-55% to-transparent z-0" />

      {/* Hero content - shifted more to the right */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:pl-20 lg:pl-28 xl:pl-36 pr-6 max-w-5xl relative z-10 -translate-y-5 sm:-translate-y-7 md:-translate-y-8">
        {/* Status badge - AVAILABLE FOR ENGINEERING & DESIGN PROJECTS */}
        <motion.div {...fadeUp(0)} className="flex mb-8">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide text-white/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AVAILABLE FOR ENGINEERING &amp; DESIGN PROJECTS
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-fluid-h1 mb-6 tracking-tight text-left leading-[1.05]"
        >
          <span className="text-white font-medium block">Engineering</span>
          <span className="text-zinc-400 font-medium block">Meets Design.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-sm sm:text-base md:text-lg text-zinc-300 mb-10 max-w-xl text-left leading-relaxed font-normal"
        >
          CSWP Certified CAD Designer | Building Autonomous &amp; Intelligent Robotic Systems
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.3)} className="flex flex-row gap-3.5 items-center mb-12">
          <button
            onClick={() => handleScroll('projects')}
            className="bg-white text-black hover:bg-zinc-200 font-medium px-7 py-3 rounded-lg transition-all flex items-center gap-2 text-sm shadow-md"
          >
            View Work <ArrowRight size={15} />
          </button>
          <button
            onClick={() => handleScroll('contact')}
            className="bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] font-medium px-7 py-3 rounded-lg transition-all text-sm"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Section 1: Enlarged Factual Stats - Fixed column widths + tabular-nums to prevent any vibration/jitter */}
        <motion.div
          {...fadeUp(0.45)}
          className="flex flex-row items-start gap-8 sm:gap-12 pt-6 border-t border-white/10 max-w-2xl"
        >
          {/* Block 1: Projects Delivered (fixed min-width prevents pushing adjacent blocks) */}
          <div className="flex-shrink-0 min-w-[135px] sm:min-w-[160px]">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-2 leading-none tabular-nums">
              <AscendingCounter target={60} suffix="+" />
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider leading-snug">
              PROJECTS
              <br />
              DELIVERED
            </p>
          </div>

          {/* Block 2: 3D & Design Experience (fixed min-width and static 3+ to stay completely anchored) */}
          <div className="border-l border-white/10 pl-8 sm:pl-12 flex-shrink-0 min-w-[140px] sm:min-w-[170px]">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-2 leading-none tabular-nums">
              3+ <span className="text-2xl sm:text-3xl font-medium text-zinc-300">Years</span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider leading-snug">
              3D &amp; DESIGN
              <br />
              EXPERIENCE
            </p>
          </div>

          {/* Block 3: CSWP (CSW white and P red - anchored) */}
          <div className="border-l border-white/10 pl-8 sm:pl-12 flex-shrink-0 min-w-[140px] sm:min-w-[170px]">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-2 leading-none">
              <span className="text-white">CSW</span>
              <span className="text-[#ef4444] font-semibold">P</span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider leading-snug">
              CERTIFIED SOLIDWORKS
              <br />
              PROFESSIONAL
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
