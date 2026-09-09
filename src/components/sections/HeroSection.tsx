'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
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

// Ascending animated counter for factual engineering numbers
function AscendingCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1600;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// 26 Technical Skills categorized across 2 balanced marquee rows (matching reference design)
const SKILLS_ROW_1 = [
  { name: 'SOLIDWORKS', color: '#f43f5e' },
  { name: 'PLC', color: '#06b6d4' },
  { name: 'PYTHON', color: '#facc15' },
  { name: 'AUTOCAD', color: '#ef4444' },
  { name: 'HMI', color: '#14b8a6' },
  { name: 'C', color: '#3b82f6' },
  { name: 'INVENTOR', color: '#f97316' },
  { name: 'LADDER LOGIC', color: '#10b981' },
  { name: 'MATLAB', color: '#ea580c' },
  { name: 'BLENDER', color: '#38bdf8' },
  { name: 'SENSORS', color: '#84cc16' },
  { name: 'JAVASCRIPT', color: '#eab308' },
  { name: 'ANSYS', color: '#fbbf24' },
];

const SKILLS_ROW_2 = [
  { name: 'ACTUATORS', color: '#f59e0b' },
  { name: 'SQL', color: '#0ea5e9' },
  { name: 'RASPBERRY PI', color: '#e11d48' },
  { name: 'ROBOTICS', color: '#22d3ee' },
  { name: '3D PRINTING', color: '#34d399' },
  { name: 'ESP32', color: '#2dd4bf' },
  { name: 'UAV SYSTEMS', color: '#60a5fa' },
  { name: 'PCB DESIGN', color: '#4ade80' },
  { name: 'ARDUINO', color: '#06b6d4' },
  { name: 'KINEMATICS', color: '#a78bfa' },
  { name: 'DFM', color: '#a3e635' },
  { name: 'VHDL', color: '#c084fc' },
  { name: 'EMBEDDED SYSTEMS', color: '#818cf8' },
];

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
        {/* Status badge - Updated to AVAILABLE FOR ENGINEERING & DESIGN PROJECTS */}
        <motion.div {...fadeUp(0)} className="flex mb-8">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 backdrop-blur-md border border-white/10 text-xs font-mono font-medium tracking-wide text-white/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AVAILABLE FOR ENGINEERING &amp; DESIGN PROJECTS
          </span>
        </motion.div>

        {/* Heading - Kept strictly as is */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-fluid-h1 mb-6 tracking-tight text-left leading-[1.05]"
        >
          <span className="text-white font-medium block">Engineering</span>
          <span className="text-zinc-400 font-medium block">Meets Design.</span>
        </motion.h1>

        {/* Subtitle - Updated specification */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-sm sm:text-base md:text-lg text-zinc-300 mb-10 max-w-xl text-left leading-relaxed font-normal"
        >
          CSWP Certified CAD Designer | Building Autonomous &amp; Intelligent Robotic Systems
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

        {/* Factual Engineering Stats with Ascending Counter Animation */}
        <motion.div
          {...fadeUp(0.45)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-white/10 max-w-2xl"
        >
          {/* Block 1: Projects Delivered */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-mono">
                <AscendingCounter target={60} suffix="+" />
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Projects Delivered
            </p>
          </div>

          {/* Block 2: 3D & Design Experience */}
          <div className="border-l border-white/10 pl-6 sm:pl-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-mono">
                <AscendingCounter target={3} suffix="+" /> Years
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              3D &amp; Design Experience
            </p>
          </div>

          {/* Block 3: CSWP with CSW in white and P in red */}
          <div className="border-l border-white/10 pl-6 sm:pl-10 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight font-mono">
                <span className="text-white">CSW</span>
                <span className="text-[#ef4444] font-bold">P</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Certified SOLIDWORKS Professional
            </p>
          </div>
        </motion.div>
      </div>

      {/* 2-Layer Technical Skills Marquee Grid (Matching Image 2 Reference) */}
      <motion.div
        {...fadeUp(0.6)}
        className="w-full mt-16 relative z-10 overflow-hidden border-y border-white/[0.08] bg-[#0c0c0f]/80 backdrop-blur-md"
      >
        {/* Soft edge fade masks for smooth entrance/exit */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]">
          {/* Layer 1 */}
          <div className="border-b border-white/[0.08]">
            <div className="marquee-track flex">
              {[...SKILLS_ROW_1, ...SKILLS_ROW_1].map((skill, index) => (
                <div
                  key={`r1-${skill.name}-${index}`}
                  className="group relative flex items-center justify-center h-14 sm:h-16 px-6 sm:px-8 min-w-[170px] sm:min-w-[210px] border-r border-white/[0.08] hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <ArrowUpRight
                    size={11}
                    className="absolute top-2 right-2 text-zinc-600 group-hover:text-zinc-300 transition-colors"
                  />
                  <span
                    className="font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 group-hover:scale-105"
                    style={{ color: skill.color }}
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div>
            <div className="marquee-track flex">
              {[...SKILLS_ROW_2, ...SKILLS_ROW_2].map((skill, index) => (
                <div
                  key={`r2-${skill.name}-${index}`}
                  className="group relative flex items-center justify-center h-14 sm:h-16 px-6 sm:px-8 min-w-[170px] sm:min-w-[210px] border-r border-white/[0.08] hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <ArrowUpRight
                    size={11}
                    className="absolute top-2 right-2 text-zinc-600 group-hover:text-zinc-300 transition-colors"
                  />
                  <span
                    className="font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 group-hover:scale-105"
                    style={{ color: skill.color }}
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
