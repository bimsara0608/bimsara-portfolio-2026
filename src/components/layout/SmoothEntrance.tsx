'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * SmoothEntrance / PageTransition
 *
 * Plays a full-screen dark curtain that fades out on every route
 * change (including client-side navigation). Fixes the "ugly pop"
 * when entering a project page and the "laggy" feel navigating away.
 *
 * Uses setTimeout-only approach (no synchronous setState in effects)
 * to satisfy the react-hooks/set-state-in-effect lint rule.
 */
export function SmoothEntrance() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // First render: useState(true) already shows curtain; just schedule hide
      isFirstRender.current = false;
      const timer = setTimeout(() => setVisible(false), 80);
      return () => clearTimeout(timer);
    }

    // Subsequent navigations: flash curtain visible then fade out
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => setVisible(false), 80);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#09090b] pointer-events-none transition-opacity duration-500 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
}
