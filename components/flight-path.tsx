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
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="#E8C97A"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.6"
        />
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="#C4706E"
          strokeWidth="2.5"
          strokeDasharray={`${tVal * 650} 650`}
        />
        <text x={startX} y={height - 2} textAnchor="middle" className="fill-navy text-xs font-medium">
          {t("flight.tokyo")}
        </text>
        <text x={endX} y={height - 2} textAnchor="middle" className="fill-navy text-xs font-medium">
          {t("flight.kl")}
        </text>
        <text x={x} y={y} textAnchor="middle" fontSize="20" className="select-none">
          ✈️
        </text>
      </svg>
    </div>
  );
}
