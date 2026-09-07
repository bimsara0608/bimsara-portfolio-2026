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

const TOOLS = [
  { name: 'SolidWorks', icon: '⚙️' },
  { name: 'Blender', icon: '🎨' },
  { name: 'ANSYS', icon: '🔬' },
  { name: 'AutoCAD', icon: '📐' },
  { name: 'Fusion 360', icon: '🔧' },
  { name: 'KeyShot', icon: '💡' },
  { name: 'Cura', icon: '🖨️' },
  { name: 'Figma', icon: '✏️' },
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
      className="w-full min-h-[110svh] flex flex-col items-center justify-center pt-28 pb-24 px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center w-full">
        {/* Status badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-10">
          <span className="hero-badge bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white uppercase flex items-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Available for freelance work
          </span>
        </motion.div>

        {/* Heading - Two color effect */}
        <motion.h1 {...fadeUp(0.1)} className="text-fluid-h1 mb-6 text-balance tracking-tight">
          <span className="text-white font-medium">Hi, I&apos;m {profile.name.split(' ')[0]}.</span>{' '}
          <span className="text-muted-foreground font-medium">Design Engineer & 3D Artist.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-fluid-p text-muted-foreground mb-12 text-balance max-w-2xl mx-auto"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA Buttons - Solid Pill Style */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
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

        {/* Stats */}
        <motion.div {...fadeUp(0.45)} className="mt-24 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <AnimatedNumber
              value={pStats.value}
              suffix={pStats.suffix}
              className="block text-4xl stat-number mb-2 text-white font-medium tracking-tight"
            />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Projects
            </p>
          </div>

          <div className="text-center border-x border-white/10 px-4">
            <AnimatedNumber
              value={eStats.value}
              suffix={eStats.suffix}
              className="block text-4xl stat-number mb-2 text-white font-medium tracking-tight"
            />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Years Exp.
            </p>
          </div>

          <div className="text-center">
            <p className="block text-4xl stat-number mb-2 text-white font-medium tracking-tight">
              {profile.stat_certification}
            </p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Certified
            </p>
          </div>
        </motion.div>

        {/* Tools & Technologies */}
        <motion.div {...fadeUp(0.6)} className="mt-20">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Tools &amp; Technologies
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TOOLS.map((tool) => (
              <span
                key={tool.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-[13px] font-medium text-gray-300 hover:text-white hover:border-white/30 transition-colors"
              >
                <span>{tool.icon}</span>
                {tool.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
