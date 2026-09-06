interface StatItemProps {
  value: string;
  label: string;
}

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="border-l border-gray-200 pl-6 py-2">
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-muted font-medium uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
}
