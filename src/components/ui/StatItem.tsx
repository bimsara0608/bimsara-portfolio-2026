interface StatItemProps {
  value: string;
  label: string;
}

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="border-l border-white/20 pl-6 py-2">
      <div className="text-4xl font-bold mb-1 text-white">{value}</div>
      <div className="text-muted-foreground font-medium uppercase tracking-wider text-xs">
        {label}
      </div>
    </div>
  );
}
