'use client';

import { useEffect, useState } from 'react';

/**
 * SmoothEntrance
 *
 * Provides a clean initial-load dark curtain to prevent hydration flash
 * when first entering the site. Route transitions are handled seamlessly
 * by route-level loading skeletons and page entrance animations.
 */
export function SmoothEntrance() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#09090b] pointer-events-none transition-opacity duration-500 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
}
