'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PreloaderPhase = 'loading' | 'flying' | 'settling' | 'done';

interface PreloaderOverlayProps {
  phase: PreloaderPhase;
}

export function PreloaderOverlay({ phase }: PreloaderOverlayProps) {
  // Lock body scroll during preloader so the hero doesn't jump on first frame
  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-end pb-14 pointer-events-auto select-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'settling' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Loading indicator — rotor ring + label, only visible during loading phase */}
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ opacity: phase === 'loading' ? 1 : 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Spinning rotor disk ring */}
            <div className="relative w-7 h-7">
              {/* Outer static dim ring */}
              <div className="absolute inset-0 rounded-full border border-[#00d4ff]/12" />
              {/* Inner spinning arc */}
              <div
                className="absolute inset-0 rounded-full border-t-[1.5px] border-r-[1.5px] border-[#00d4ff] opacity-80"
                style={{ animation: 'spin 0.9s linear infinite' }}
              />
              {/* Subtle glow dot at center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#00d4ff]/40" />
              </div>
            </div>

            {/* Label */}
            <span
              className="text-[8.5px] font-mono tracking-[0.35em] uppercase"
              style={{ color: 'rgba(0, 212, 255, 0.28)' }}
            >
              Initializing
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
