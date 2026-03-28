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
import type { Task, SavingsEntry, VisaStep } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [loading, setLoading] = useState(true);

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
        <p className="text-muted-foreground">Loading your journey...</p>
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
  const phaseLabels: Record<string, string> = {
    A: "Foundation",
    B: "Income Building",
    C: "Visa Application",
    D: "Relocation",
  };

  const upcoming = tasks
    .filter((t) => t.status !== "done" && t.deadline)
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
            Your Journey to Malaysia
          </h2>
          <FlightPath />
        </CardContent>
      </Card>

      {/* Countdown + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Countdown />
        <StatCard
          icon="✅"
          label="Tasks Completed"
          value={`${taskPercent}%`}
          subtitle={`${doneTasks} of ${totalTasks} tasks`}
        />
        <StatCard
          icon="💰"
          label="Savings Progress"
          value={<Money amount={currentSavings} from="JPY" />}
          subtitle={`of ¥1,200,000 target`}
        />
        <StatCard
          icon="📄"
          label="Visa Status"
          value={`Phase ${currentPhase}`}
          subtitle={`${phaseLabels[currentPhase]} • ${visaPercent}%`}
        />
      </div>

      {/* Progress Bars */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <ProgressBar value={taskPercent} label="Overall Progress" />
          <ProgressBar value={savingsPercent} label="Savings Target" />
          <ProgressBar value={visaPercent} label="Visa Steps" />
        </CardContent>
      </Card>

      {/* Encouragement */}
      <EncouragementBanner />

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-navy text-base">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming deadlines — you're all caught up!</p>
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
                    {task.priority}
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
