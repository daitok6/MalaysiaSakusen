"use client";

import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";
import { CircleCheck, CircleMinus, ShieldAlert } from "lucide-react";
import type { SavingsEntry } from "@/lib/types";

type CheckpointGateProps = {
  savings: SavingsEntry[];
};

export function CheckpointGate({ savings }: CheckpointGateProps) {
  const { t } = useLocale();
  const throughAug = savings.filter((s) => s.month <= "2026-08");
  const totalSaved = throughAug.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );

  const augEntry = savings.find((s) => s.month === "2026-08");
  const latestSideIncome = augEntry?.actualSideIncome ?? 0;

  const checks = [
    {
      label: t("finances.checkpoint.savings"),
      passed: totalSaved >= 400000,
      display: <Money amount={totalSaved} from="JPY" />,
    },
    {
      label: t("finances.checkpoint.income"),
      passed: latestSideIncome >= 80000,
      display: <Money amount={latestSideIncome} from="JPY" />,
    },
  ];

  return (
    <div className="glass">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={18} className="text-marigold-foreground" />
        <h3 className="text-sm font-bold">{t("finances.checkpoint.title")}</h3>
      </div>
      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {check.passed ? (
                <CircleCheck size={20} className="text-mint-foreground" />
              ) : (
                <CircleMinus size={20} className="text-muted-foreground" />
              )}
              <span className="text-sm">{check.label}</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{check.display}</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">
          {t("finances.checkpoint.warning")}
        </p>
      </div>
    </div>
  );
}
