'use client';

import { useEffect, useState } from 'react';

export function SmoothEntrance() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#09090b] pointer-events-none transition-opacity duration-400 ease-out ${
        revealed ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    />
  );
}
