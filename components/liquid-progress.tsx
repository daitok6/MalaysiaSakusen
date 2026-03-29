type LiquidProgressProps = {
  value: number; // 0-100
  label?: string;
  className?: string;
};

export function LiquidProgress({ value, label, className = "" }: LiquidProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`glass ${className}`}>
      {label && (
        <div className="flex justify-between text-sm mb-3">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground text-xs font-bold tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="relative h-6 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${clamped}%`,
            background: "linear-gradient(90deg, #6C63FF, #B8B5FF, #A7E8BD)",
          }}
        />
        {/* Animated wave overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 Q25 6 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 V24 H0 Z"
            fill="rgba(255,255,255,0.2)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-50,0;0,0;-50,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
}
