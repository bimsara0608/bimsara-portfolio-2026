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
      className="w-full min-h-[100svh] flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 relative overflow-hidden"
    >
      {/* Left protective gradient scrim - Desktop only */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[56%] lg:w-[52%] pointer-events-none bg-gradient-to-r from-background via-background/90 via-55% to-transparent z-0" />

      {/* Top & Bottom protective gradient scrims - Mobile only: solid backing behind text, gentle fade toward drone window */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-[38%] pointer-events-none bg-gradient-to-b from-[#09090b] via-[#09090b] via-[50%] to-transparent z-0" />
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[46%] pointer-events-none bg-gradient-to-t from-[#09090b] via-[#09090b] via-[48%] to-transparent z-0" />

      {/* Hero content - Centered on mobile, left-aligned on desktop */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-5 sm:px-8 md:pl-20 lg:pl-28 xl:pl-36 md:pr-6 max-w-5xl mx-auto md:mx-0 w-full relative z-10 -translate-y-10 sm:-translate-y-4 md:-translate-y-8">
        {/* Status badge */}
        <motion.div
          {...fadeUp(0)}
          className="flex justify-center md:justify-start mb-2.5 sm:mb-6 md:mb-8 w-full"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-4 md:py-2 rounded-full bg-[#111114]/95 backdrop-blur-lg border border-white/20 text-[9px] md:text-[11.5px] font-bold tracking-widest text-white shadow-md uppercase">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            AVAILABLE FOR ENGINEERING &amp; DESIGN PROJECTS
          </span>
        </motion.div>

        {/* Heading - Maximum impact, large, confident, and heroic on mobile */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-[2.95rem] xs:text-[3.35rem] sm:text-6xl md:text-fluid-h1 md:leading-[1.05] mb-2 sm:mb-4 md:mb-6 tracking-tight font-extrabold leading-[1.01] text-center md:text-left drop-shadow-[0_4px_24px_rgba(0,0,0,1)]"
        >
          <span className="text-white block">Engineering</span>
          <span className="text-zinc-100 block">Meets Design.</span>
        </motion.h1>

        {/* 3D Drone & CFD Flowlines Window (Mobile only, dedicated transparent spacer between title & subtitle) */}
        <div
          className="h-40 sm:h-52 w-full my-2 sm:my-3 relative pointer-events-none md:hidden"
          aria-hidden="true"
        />

        {/* Subtitle - Large, prominent, high-contrast on mobile */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-base xs:text-[17px] sm:text-lg md:text-lg text-zinc-100 max-w-sm sm:max-w-md md:max-w-xl mb-4 sm:mb-8 md:mb-10 text-center md:text-left leading-relaxed font-medium mx-auto md:mx-0 drop-shadow-[0_2px_16px_rgba(0,0,0,1)]"
        >
          CSWP Certified CAD Designer | Building Autonomous &amp; Intelligent Robotic Systems
        </motion.p>

        {/* CTA Buttons - Large, tactile, comfortable mobile touch targets */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-row justify-center md:justify-start gap-3 sm:gap-3.5 items-center mb-8 sm:mb-10 md:mb-12 w-full max-w-[360px] sm:max-w-none"
        >
          <button
            onClick={() => handleScroll('projects')}
            className="flex-1 sm:flex-initial bg-white text-black hover:bg-zinc-200 font-bold px-6 sm:px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[15px] sm:text-base shadow-lg shadow-white/10 active:scale-[0.98]"
          >
            View Work <ArrowRight size={16} />
          </button>
          <button
            onClick={() => handleScroll('contact')}
            className="flex-1 sm:flex-initial bg-white/[0.08] border border-white/20 text-white hover:bg-white/[0.14] font-bold px-6 sm:px-7 py-3.5 rounded-xl transition-all text-[15px] sm:text-base backdrop-blur-md active:scale-[0.98]"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Section 1: Enlarged Factual Stats - Bold, prominent numbers */}
        <motion.div
          {...fadeUp(0.45)}
          className="w-full max-w-sm sm:max-w-md md:max-w-2xl pt-6 border-t border-white/20 grid grid-cols-3 divide-x divide-white/20 md:flex md:flex-row md:items-start md:gap-8 md:divide-x-0 lg:gap-12"
        >
          {/* Block 1: Projects Delivered */}
          <div className="px-2 sm:px-3 md:px-0 md:flex-shrink-0 md:min-w-[135px] lg:min-w-[160px] text-center md:text-left">
            <div className="text-[2.2rem] xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-1.5 md:mb-2 leading-none tabular-nums drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              <AscendingCounter target={60} suffix="+" />
            </div>
            <p className="text-[10.5px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider leading-snug">
              PROJECTS
              <br />
              DELIVERED
            </p>
          </div>

          {/* Block 2: 3D & Design Experience */}
          <div className="px-2 sm:px-3 md:px-0 md:border-l md:border-white/20 md:pl-8 lg:pl-12 md:flex-shrink-0 md:min-w-[140px] lg:min-w-[170px] text-center md:text-left">
            <div className="text-[2.2rem] xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-1.5 md:mb-2 leading-none tabular-nums drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              3+{' '}
              <span className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-zinc-200">
                Years
              </span>
            </div>
            <p className="text-[10.5px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider leading-snug">
              3D &amp; DESIGN
              <br />
              EXPERIENCE
            </p>
          </div>

          {/* Block 3: CSWP */}
          <div className="px-2 sm:px-3 md:px-0 md:border-l md:border-white/20 md:pl-8 lg:pl-12 md:flex-shrink-0 md:min-w-[140px] lg:min-w-[170px] text-center md:text-left">
            <div className="text-[2.2rem] xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight mb-1.5 md:mb-2 leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              <span className="text-white">CSW</span>
              <span className="text-[#ef4444] font-black">P</span>
            </div>
            <p className="text-[10.5px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider leading-snug">
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
