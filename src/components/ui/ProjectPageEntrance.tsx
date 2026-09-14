'use client';

import { motion } from 'framer-motion';

/**
 * ProjectPageEntrance
 *
 * Wraps the project detail page in a smooth fade + slide-up
 * entrance animation. Combined with the SmoothEntrance curtain,
 * this eliminates the jarring "ugly pop" when entering a project.
 */
export function ProjectPageEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
