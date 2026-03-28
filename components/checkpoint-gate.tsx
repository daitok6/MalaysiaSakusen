"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";
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
    <Card className="border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-navy flex items-center gap-2">
          🚦 {t("finances.checkpoint.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{check.passed ? "✅" : "❌"}</span>
              <span className="text-sm font-medium">{check.label}</span>
            </div>
            <span className={`text-sm font-bold ${check.passed ? "text-success" : "text-primary"}`}>
              {check.display}
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-2">
          {t("finances.checkpoint.warning")}
        </p>
      </CardContent>
    </Card>
  );
}
