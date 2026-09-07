'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import type { Profile } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile;
}

function parseStat(stat: string) {
  const match = stat.match(/^(\d+)(.*)$/);
  if (match) return { value: parseInt(match[1]), suffix: match[2] };
  return { value: parseInt(stat) || 0, suffix: '' };
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

const SOFTWARE_MARQUEE = [
  'SolidWorks',
  'Blender',
  'ANSYS',
  'AutoCAD',
  'Fusion 360',
  'KeyShot',
  'Cura',
  'Figma',
  'SolidWorks',
  'Blender',
  'ANSYS',
  'AutoCAD',
  'Fusion 360',
  'KeyShot',
  'Cura',
  'Figma',
];

export function HeroSection({ profile }: HeroSectionProps) {
  const pStats = parseStat(profile.stat_projects || '60+');
  const eStats = parseStat(profile.stat_experience || '3+');

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="w-full min-h-[100svh] flex flex-col justify-center pt-28 pb-0 relative"
    >
      {/* Left-aligned content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 max-w-5xl">
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

        {/* Stats - below CTA, bigger and horizontal */}
        <motion.div {...fadeUp(0.45)} className="flex flex-row gap-10 sm:gap-16">
          <div>
            <AnimatedNumber
              value={pStats.value}
              suffix={pStats.suffix}
              className="block text-5xl sm:text-6xl stat-number text-white font-medium tracking-tight leading-none mb-2"
            />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Projects Delivered
            </p>
          </div>

          <div className="border-l border-white/10 pl-10 sm:pl-16">
            <AnimatedNumber
              value={eStats.value}
              suffix={eStats.suffix}
              className="block text-5xl sm:text-6xl stat-number text-white font-medium tracking-tight leading-none mb-2"
            />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Years Experience
            </p>
          </div>

          <div className="border-l border-white/10 pl-10 sm:pl-16">
            <p className="block text-5xl sm:text-6xl stat-number text-white font-medium tracking-tight leading-none mb-2">
              {profile.stat_certification}
            </p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Certified
            </p>
          </div>
        </motion.div>
      </div>

      {/* Capabilities Marquee – full-width frosted glass bar at bottom of hero */}
      <motion.div
        {...fadeUp(0.6)}
        className="w-full mt-20 bg-black/50 backdrop-blur-xl border-t border-white/8 py-4 overflow-hidden"
      >
        <div className="flex items-center gap-0">
          {/* Static label */}
          <span className="flex-shrink-0 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-r border-white/10 pr-6 mr-0">
            Capabilities
          </span>
          {/* Marquee track */}
          <div className="overflow-hidden flex-1">
            <div className="marquee-track">
              {[...SOFTWARE_MARQUEE, ...SOFTWARE_MARQUEE].map((name, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 px-6 text-[13px] font-medium text-muted-foreground hover:text-white transition-colors cursor-default tracking-wide"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
