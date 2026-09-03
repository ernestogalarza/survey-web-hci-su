interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
}

export function ProgressBar({ label, current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#2c3e50]/70">
        {label}
      </span>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#ecf0f1]">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#3498db] to-[#2980b9] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
