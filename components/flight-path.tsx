"use client";

import { useState, useEffect } from "react";
import { useLocale } from "./locale-provider";

const START_DATE = new Date("2026-03-28");
const TARGET_DATE = new Date("2026-11-01");

export function FlightPath() {
  const [progress, setProgress] = useState(0);
  const { t } = useLocale();

  useEffect(() => {
    const now = new Date();
    const total = TARGET_DATE.getTime() - START_DATE.getTime();
    const elapsed = now.getTime() - START_DATE.getTime();
    setProgress(Math.min(1, Math.max(0, elapsed / total)));
  }, []);

  const width = 600;
  const height = 120;
  const startX = 60;
  const endX = 540;
  const arcY = 30;

  const tVal = progress;
  const x = startX + tVal * (endX - startX);
  const y = height - 20 - 4 * arcY * tVal * (1 - tVal);

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Dashed track */}
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="#E8E4DF"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {/* Progress arc */}
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="url(#flightGradient)"
          strokeWidth="3"
          strokeDasharray={`${tVal * 650} 650`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8B5FF" />
            <stop offset="100%" stopColor="#A7E8BD" />
          </linearGradient>
        </defs>
        {/* City labels */}
        <text x={startX} y={height - 2} textAnchor="middle" className="fill-foreground text-xs font-bold">
          {t("flight.tokyo")}
        </text>
        <text x={endX} y={height - 2} textAnchor="middle" className="fill-foreground text-xs font-bold">
          {t("flight.kl")}
        </text>
        {/* Plane SVG icon instead of emoji */}
        <g transform={`translate(${x - 10}, ${y - 10})`}>
          <circle cx="10" cy="10" r="14" fill="#B8B5FF" opacity="0.2" />
          <path
            d="M10 4L7 10H4L6 12L4 20H7L10 16L13 20H16L14 12L16 10H13L10 4Z"
            fill="#8B85C1"
          />
        </g>
      </svg>
    </div>
  );
}
