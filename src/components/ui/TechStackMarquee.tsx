'use client';

import { memo } from 'react';

interface TechStackMarqueeProps {
  stack: string[];
}

export const TechStackMarquee = memo(function TechStackMarquee({ stack }: TechStackMarqueeProps) {
  if (!stack || stack.length === 0) return null;

  // Duplicate the array twice to ensure seamless infinite scroll
  const duplicatedStack = [...stack, ...stack, ...stack];

  return (
    <div className="w-full overflow-hidden bg-foreground py-4 border-y border-border">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex whitespace-nowrap">
          {duplicatedStack.map((tech, idx) => (
            <span
              key={idx}
              className="mx-4 text-xl md:text-3xl font-black text-background uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default"
            >
              {tech} <span className="text-muted-foreground mx-4">•</span>
            </span>
          ))}
        </div>
        <div
          className="absolute top-0 animate-marquee flex whitespace-nowrap"
          style={{ left: '100%' }}
        >
          {duplicatedStack.map((tech, idx) => (
            <span
              key={idx + duplicatedStack.length}
              className="mx-4 text-xl md:text-3xl font-black text-background uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default"
            >
              {tech} <span className="text-muted-foreground mx-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
