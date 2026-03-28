"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "./locale-provider";

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
    <Card className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-gold/30">
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-navy/70 font-medium mb-1">{t("dashboard.countdown.label")}</p>
        <p className="text-5xl font-bold text-navy">{days}</p>
        <p className="text-gold mt-2 text-lg">☆</p>
        <p className="text-sm text-muted-foreground mt-1">
          {days > 200
            ? t("dashboard.countdown.plenty")
            : days > 100
            ? t("dashboard.countdown.halfway")
            : days > 30
            ? t("dashboard.countdown.close")
            : t("dashboard.countdown.almost")}
        </p>
      </CardContent>
    </Card>
  );
}
