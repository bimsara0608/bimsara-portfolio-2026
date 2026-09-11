'use client';

import { useEffect, useState } from 'react';

export function SmoothEntrance() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Give browser 100ms to settle initial WebGL and layout rendering, then smoothly reveal
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#09090b] pointer-events-none transition-opacity duration-1000 ease-out ${
        revealed ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    />
  );
}
