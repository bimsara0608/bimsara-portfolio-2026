'use client';

import { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  className = '',
  duration = 1800,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial value
    el.textContent = `${prefix}0${suffix}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const startTime = performance.now();
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(easeOut(progress) * value);
            if (el) {
              el.textContent = `${prefix}${current}${suffix}`;
            }
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              if (el) el.textContent = `${prefix}${value}${suffix}`;
            }
          };

          requestAnimationFrame(tick);
        }
      },
      // Trigger when element is fully visible (no negative margin bug)
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix, prefix, duration]);

  return (
    <span ref={ref} className={`stat-number ${className}`}>
      {prefix}0{suffix}
    </span>
  );
}
