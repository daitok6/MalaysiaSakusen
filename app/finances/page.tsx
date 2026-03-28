"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { SavingsTable } from "@/components/savings-table";
import { CostComparison } from "@/components/cost-comparison";
import { CheckpointGate } from "@/components/checkpoint-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SavingsEntry } from "@/lib/types";

export default function FinancesPage() {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
        <p className="text-muted-foreground">Loading finances...</p>
      </div>
    );
  }

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Finances</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your savings and compare costs
        </p>
      </div>

      {/* Savings Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-3xl font-bold text-navy">
                <Money amount={currentSavings} from="JPY" />
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Target: <Money amount={savingsTarget} from="JPY" />
            </p>
          </div>
          <ProgressBar value={savingsPercent} />
        </CardContent>
      </Card>

      {/* Income by Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 1: Immediate Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $1,000–$2,800/mo</p>
            <p className="text-sm mt-1">DataAnnotation, Outlier, CrowdWorks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 2: Stability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $1,500–$3,500/mo</p>
            <p className="text-sm mt-1">Freelance dev, translation, VA work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 3: Scalable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $2,000–$10,000/mo</p>
            <p className="text-sm mt-1">SaaS, digital products, newsletter</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Savings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Monthly Savings Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <SavingsTable savings={savings} onUpdate={handleUpdate} />
        </CardContent>
      </Card>

      {/* Checkpoint Gate */}
      <CheckpointGate savings={savings} />

      {/* Cost of Living Comparison */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-4">Cost of Living Comparison</h2>
        <CostComparison />
      </div>
    </div>
  );
}
