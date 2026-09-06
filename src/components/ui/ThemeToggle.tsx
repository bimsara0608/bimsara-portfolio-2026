'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground relative w-9 h-9 flex items-center justify-center overflow-hidden"
    >
      <div
        className={`transition-transform duration-500 absolute ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
      >
        <Sun size={18} />
      </div>
      <div
        className={`transition-transform duration-500 absolute ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
      >
        <Moon size={18} />
      </div>
    </button>
  );
}
