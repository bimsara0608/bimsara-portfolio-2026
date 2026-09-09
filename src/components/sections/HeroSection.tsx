'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Profile } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

export function HeroSection({ profile }: HeroSectionProps) {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="w-full min-h-[100svh] flex flex-col justify-center pt-28 pb-0 relative overflow-hidden"
    >
      {/* Left protective gradient scrim for maximum text legibility */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[54%] lg:w-[50%] pointer-events-none bg-gradient-to-r from-background via-background/90 via-55% to-transparent z-0" />

      {/* Left-aligned content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 max-w-5xl relative z-10">
        {/* Status badge */}
        <motion.div {...fadeUp(0)} className="flex mb-8">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 backdrop-blur-md border border-white/10 text-xs font-mono font-medium tracking-wide text-white/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AVAILABLE FOR DESIGN &amp; CAD ENGINEERING
          </span>
        </motion.div>

        {/* Heading - Attio Inter precision */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-fluid-h1 mb-6 tracking-tight text-left leading-[1.05]"
        >
          <span className="text-white font-medium block">Engineering</span>
          <span className="text-zinc-400 font-medium block">Meets Design.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-fluid-p text-zinc-300 mb-10 max-w-lg text-left leading-relaxed"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.3)} className="flex flex-row gap-3.5 items-center mb-16">
          <button
            onClick={() => handleScroll('projects')}
            className="bg-white text-black hover:bg-zinc-200 font-semibold px-7 py-3 rounded-lg transition-all flex items-center gap-2 text-sm shadow-md"
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

        {/* Factual Engineering Signals */}
        <motion.div
          {...fadeUp(0.45)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-white/10 max-w-2xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-mono">
                CSWP
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Certified SolidWorks Professional
            </p>
          </div>

          <div className="border-l border-white/10 pl-6 sm:pl-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-mono">
                B.Eng.Tech
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Instrumentation &amp; Automation
            </p>
          </div>

          <div className="border-l border-white/10 pl-6 sm:pl-10 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-mono">
                DFM &amp; CAD
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Manufacturing-Ready
            </p>
          </div>
        </motion.div>
      </div>

      {/* 4 Categorized Engineering Capabilities Bar */}
      <motion.div
        {...fadeUp(0.6)}
        className="w-full mt-16 bg-[#09090b]/80 backdrop-blur-xl border-t border-white/[0.08] py-5 px-6 lg:px-16 relative z-10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              01 / CAD &amp; PRODUCT DESIGN
            </span>
            <p className="text-xs font-medium text-white/90">SolidWorks · Fusion 360 · AutoCAD</p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              02 / 3D &amp; VISUALIZATION
            </span>
            <p className="text-xs font-medium text-white/90">
              Blender · KeyShot · Product Animation
            </p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              03 / AUTOMATION &amp; ROBOTICS
            </span>
            <p className="text-xs font-medium text-white/90">
              PLC · HMI · Embedded Systems · Robotics
            </p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              04 / PROTOTYPING &amp; DFM
            </span>
            <p className="text-xs font-medium text-white/90">
              3D Printing (FDM/SLA) · Rapid Iteration
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
