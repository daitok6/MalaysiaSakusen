type ProgressBarProps = {
  value: number; // 0-100
  label?: string;
  className?: string;
};

export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground text-xs font-bold tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-3 rounded-full bg-white/30 overflow-hidden progress-striped backdrop-blur-sm">
        <div
          className="h-full rounded-full progress-fill transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
