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
      className="w-full min-h-[95svh] flex items-center pt-24 pb-20 px-6 lg:px-16 xl:px-24"
    >
      {/* Left-aligned on desktop, centered on mobile */}
      <div className="w-full max-w-2xl lg:mx-0 mx-auto text-center lg:text-left">
        {/* Status badge — frosted glass pill */}
        <motion.div {...fadeUp(0)} className="flex justify-center lg:justify-start mb-8">
          <span className="hero-badge backdrop-blur-md bg-black/40 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            Available for freelance work
          </span>
        </motion.div>

        {/* Heading — frosted glass card */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl backdrop-blur-md bg-black/30 border border-white/5 px-6 py-5 mb-5 inline-block w-full"
        >
          <h1 className="text-fluid-h1 text-balance">
            <span className="text-muted-foreground font-normal">Hi, I&apos;m </span>
            <span className="text-foreground">{profile.name.split(' ')[0]}</span>
          </h1>
        </motion.div>

        {/* Tagline — frosted glass card */}
        <motion.div
          {...fadeUp(0.2)}
          className="rounded-xl backdrop-blur-md bg-black/30 border border-white/5 px-6 py-4 mb-10 inline-block w-full"
        >
          <p className="text-fluid-p text-muted-foreground text-balance">{profile.tagline}</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center"
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

        {/* Stats — frosted glass bar */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-16 rounded-2xl backdrop-blur-md bg-black/30 border border-white/5 px-6 py-5 grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0"
        >
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

          <div className="text-center border-x border-white/10 px-4">
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
