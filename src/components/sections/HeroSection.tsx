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

export function HeroSection({ profile }: HeroSectionProps) {
  const pStats = parseStat(profile.stat_projects || '60+');
  const eStats = parseStat(profile.stat_experience || '3+');

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="w-full min-h-[95svh] flex items-center justify-center pt-24 pb-20 px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto text-center w-full">
        {/* Status badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <span className="hero-badge">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            Available for freelance work
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 {...fadeUp(0.1)} className="text-fluid-h1 mb-5 text-balance">
          <span className="text-muted-foreground font-normal">Hi, I&apos;m </span>
          <span className="text-foreground">{profile.name.split(' ')[0]}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-fluid-p text-muted-foreground mb-10 text-balance max-w-xl mx-auto"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            onClick={() => handleScroll('projects')}
            className="btn-primary text-base px-7 py-3"
          >
            View Work <ArrowRight size={17} />
          </button>
          <button
            onClick={() => handleScroll('contact')}
            className="btn-secondary text-base px-7 py-3"
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.45)} className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto">
          <div className="text-center">
            <AnimatedNumber
              value={pStats.value}
              suffix={pStats.suffix}
              className="block text-4xl stat-number mb-1.5 text-foreground"
            />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Projects
            </p>
          </div>

          <div className="text-center border-x border-border px-4">
            <AnimatedNumber
              value={eStats.value}
              suffix={eStats.suffix}
              className="block text-4xl stat-number mb-1.5 text-foreground"
            />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Years Exp.
            </p>
          </div>

          <div className="text-center">
            <p className="block text-4xl stat-number mb-1.5 text-foreground">
              {profile.stat_certification}
            </p>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Certified
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
