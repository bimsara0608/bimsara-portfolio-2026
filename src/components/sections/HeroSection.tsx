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
      {/* Left gradient protecting the hero text area, fully preserving typography readability while leaving the splines open */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[50%] lg:w-[48%] pointer-events-none bg-gradient-to-r from-background via-background/90 via-60% to-transparent z-0" />

      {/* Left-aligned content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 max-w-5xl relative z-10">
        {/* Status badge */}
        <motion.div {...fadeUp(0)} className="flex mb-10">
          <span className="hero-badge bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white uppercase flex items-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Available for freelance work
          </span>
        </motion.div>

        {/* Heading - Two colour effect, left-aligned */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-fluid-h1 mb-6 tracking-tight text-left leading-[1.05]"
        >
          <span className="text-white font-medium block">Engineering</span>
          <span className="text-muted-foreground font-medium block">Meets Design.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-fluid-p text-muted-foreground mb-10 max-w-lg text-left"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.3)} className="flex flex-row gap-4 items-center mb-16">
          <button
            onClick={() => handleScroll('projects')}
            className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3.5 rounded-full transition-colors flex items-center gap-2 text-[15px]"
          >
            View Work <ArrowRight size={17} />
          </button>
          <button
            onClick={() => handleScroll('contact')}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-full transition-colors text-[15px]"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Factual Engineering Signals — high credibility, zero fake numbers */}
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
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Manufacturing-Ready
            </p>
          </div>
        </motion.div>
      </div>

      {/* 4 Categorized Engineering Capabilities Bar */}
      <motion.div
        {...fadeUp(0.6)}
        className="w-full mt-16 bg-black/60 backdrop-blur-xl border-t border-white/10 py-5 px-6 lg:px-16 relative z-10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              01 / CAD &amp; PRODUCT DESIGN
            </span>
            <p className="text-xs font-medium text-white/90">SolidWorks · Fusion 360 · AutoCAD</p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              02 / 3D &amp; VISUALIZATION
            </span>
            <p className="text-xs font-medium text-white/90">
              Blender · KeyShot · Product Animation
            </p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              03 / AUTOMATION &amp; ROBOTICS
            </span>
            <p className="text-xs font-medium text-white/90">
              PLC · HMI · Embedded Systems · Robotics
            </p>
          </div>
          <div className="border-l border-white/10 pl-3.5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
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
