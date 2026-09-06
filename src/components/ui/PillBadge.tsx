import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
        "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
        isActive 
          ? "bg-accent text-white border-accent" 
          : "bg-transparent text-muted border-gray-200 hover:border-gray-300 hover:text-foreground",
        !onClick && "cursor-default"
      )}
    >
      {label}
    </button>
  );
}
