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
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-navy">{label}</span>
          <span className="text-muted-foreground">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-3 rounded-full bg-secondary overflow-hidden progress-striped">
        <div
          className="h-full rounded-full progress-fill transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
