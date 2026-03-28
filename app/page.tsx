"use client";

import { useState, useEffect } from "react";
import { FlightPath } from "@/components/flight-path";
import { Countdown } from "@/components/countdown";
import { StatCard } from "@/components/stat-card";
import { EncouragementBanner } from "@/components/encouragement-banner";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import type { Task, SavingsEntry, VisaStep } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/savings").then((r) => r.json()),
      fetch("/api/visa").then((r) => r.json()),
    ])
      .then(([tasksData, savingsData, visaData]) => {
        setTasks(tasksData);
        setSavings(savingsData);
        setVisaSteps(visaData.steps || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">{t("dashboard.loading")}</p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsTarget = 1200000;
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const completedVisaSteps = visaSteps.filter((s) => s.status === "completed").length;
  const visaPercent = visaSteps.length > 0 ? Math.round((completedVisaSteps / visaSteps.length) * 100) : 0;

  const currentPhase = visaSteps.find((s) => s.status === "in_progress")?.phase ?? "A";
  const phaseKeys: Record<string, string> = {
    A: "visa.phase.a",
    B: "visa.phase.b",
    C: "visa.phase.c",
    D: "visa.phase.d",
  };

  const upcoming = tasks
    .filter((task) => task.status !== "done" && task.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const categoryIcons: Record<string, string> = {
    visa: "📄",
    income: "💰",
    business: "🚀",
    life: "🏠",
    tech: "💻",
  };

  return (
    <div className="space-y-6">
      {/* Flight Path Hero */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6 pb-4">
          <h2 className="text-center text-navy font-bold text-lg mb-4">
            {t("dashboard.hero.title")}
          </h2>
          <FlightPath />
        </CardContent>
      </Card>

      {/* Countdown + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Countdown />
        <StatCard
          icon="✅"
          label={t("dashboard.stats.tasks")}
          value={`${taskPercent}%`}
          subtitle={`${doneTasks} / ${totalTasks}`}
        />
        <StatCard
          icon="💰"
          label={t("dashboard.stats.savings")}
          value={<Money amount={currentSavings} from="JPY" />}
          subtitle={t("dashboard.stats.savingsTarget")}
        />
        <StatCard
          icon="📄"
          label={t("dashboard.stats.visa")}
          value={`${t("dashboard.stats.phase")} ${currentPhase}`}
          subtitle={`${t(phaseKeys[currentPhase])} • ${visaPercent}%`}
        />
      </div>

      {/* Progress Bars */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <ProgressBar value={taskPercent} label={t("dashboard.progress.overall")} />
          <ProgressBar value={savingsPercent} label={t("dashboard.progress.savings")} />
          <ProgressBar value={visaPercent} label={t("dashboard.progress.visa")} />
        </CardContent>
      </Card>

      {/* Encouragement */}
      <EncouragementBanner />

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-navy text-base">{t("dashboard.deadlines.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("dashboard.deadlines.empty")}</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span>{categoryIcons[task.category] || "📌"}</span>
                    <div>
                      <p className="text-sm font-medium text-navy">
                        <span className="font-mono text-xs text-muted-foreground mr-1">{task.id}</span>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.deadline!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "critical"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : task.priority === "high"
                        ? "bg-gold/10 text-amber-700 border-gold/30"
                        : ""
                    }
                  >
                    {t(`priority.${task.priority}`)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
