'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PillBadgeProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function PillBadge({ label, isActive, onClick }: PillBadgeProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors',
        isActive
          ? 'bg-foreground text-background border-foreground'
          : 'bg-muted text-foreground border-border hover:bg-muted/80',
        !onClick && 'cursor-default'
      )}
    >
      {label}
    </button>
  );
}
