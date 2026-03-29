"use client";

import { useState, useEffect } from "react";
import { useLocale } from "./locale-provider";
import { Plane } from "lucide-react";

const TARGET_DATE = new Date("2026-11-01");

export function Countdown() {
  const [days, setDays] = useState<number | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  if (days === null) return null;

  return (
    <div className="glass-strong card-hover text-center animate-float">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Plane size={16} className="text-deep-purple" />
        <p className="text-xs text-muted-foreground font-medium">{t("dashboard.countdown.label")}</p>
      </div>
      <p className="text-5xl font-bold tracking-tighter gradient-text">{days}</p>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
        {days > 200
          ? t("dashboard.countdown.plenty")
          : days > 100
          ? t("dashboard.countdown.halfway")
          : days > 30
          ? t("dashboard.countdown.close")
          : t("dashboard.countdown.almost")}
      </p>
    </div>
  );
}
