"use client";

import { useState, useEffect } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { LiquidProgress } from "@/components/liquid-progress";
import { TiltCard } from "@/components/tilt-card";
import { Money } from "@/components/money";
import { SavingsTable } from "@/components/savings-table";
import { CostComparison } from "@/components/cost-comparison";
import { CheckpointGate } from "@/components/checkpoint-gate";
import { useLocale } from "@/components/locale-provider";
import { TrendingUp } from "lucide-react";
import type { SavingsEntry } from "@/lib/types";

export default function FinancesPage() {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/savings")
      .then((r) => r.json())
      .then(setSavings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (month: string, field: string, value: number) => {
    setSavings((prev) =>
      prev.map((s) => (s.month === month ? { ...s, [field]: value } : s))
    );
    try {
      const res = await fetch("/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, [field]: value }),
      });
      const updated = await res.json();
      setSavings(updated);
    } catch {
      fetch("/api/savings").then((r) => r.json()).then(setSavings);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const layerColors = ["pill-mint", "pill-sky", "pill-marigold"];

  return (
    <div className="space-y-10">
      {/* Piggy Bank Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/piggybank.splinecode"
          fallbackSrc="/illustrations/piggybank.svg"
          fallbackAlt="3D piggy bank"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("finances.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("finances.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Liquid Savings Progress */}
      <div className="glass-strong">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("finances.totalSavings")}</p>
            <p className="text-3xl font-bold tracking-tight mt-1 gradient-text">
              <Money amount={currentSavings} from="JPY" />
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("finances.target")} <Money amount={savingsTarget} from="JPY" />
          </p>
        </div>
        <LiquidProgress value={savingsPercent} />
      </div>

      {/* Income Layers — stacked card style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
        {["layer1", "layer2", "layer3"].map((key, i) => (
          <TiltCard key={key}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-muted-foreground" />
              <span className={`pill bounce-in ${layerColors[i]}`}>{t(`finances.${key}.title`)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t(`finances.${key}.target`)}</p>
            <p className="text-sm mt-1 leading-relaxed">{t(`finances.${key}.desc`)}</p>
          </TiltCard>
        ))}
      </div>

      {/* Savings Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("finances.table.title")}</h2>
        <div className="glass overflow-x-auto">
          <SavingsTable savings={savings} onUpdate={handleUpdate} />
        </div>
      </div>

      <CheckpointGate savings={savings} />

      {/* Cost Comparison — bar race */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("finances.col.title")}</h2>
        <CostComparison />
      </div>
    </div>
  );
}
