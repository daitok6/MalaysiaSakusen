"use client";

import { useState, useEffect } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { Countdown } from "@/components/countdown";
import { StatCard } from "@/components/stat-card";
import { EncouragementBanner } from "@/components/encouragement-banner";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { useLocale } from "@/components/locale-provider";
import { CheckCircle2, PiggyBank, FileCheck, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
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
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
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
    .sort((a, b) => {
      const aIsDate = !isNaN(new Date(a.deadline!).getTime());
      const bIsDate = !isNaN(new Date(b.deadline!).getTime());
      if (!aIsDate && bIsDate) return -1; // non-date (ASAP) comes first
      if (aIsDate && !bIsDate) return 1;
      if (!aIsDate && !bIsDate) return 0;
      return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Parallax Hero with 3D Globe */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/globe.splinecode"
          fallbackSrc="/illustrations/globe.svg"
          fallbackAlt="3D Globe showing Tokyo to KL route"
        >
          <div className="space-y-3 px-4">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter gradient-text">
              {t("dashboard.hero.title")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              {t("dashboard.hero.subtitle")}
            </p>
          </div>
        </ParallaxHero>
      </div>

      {/* Floating Countdown overlapping hero */}
      <div className="-mt-12 sm:-mt-16 relative z-20 max-w-xs sm:max-w-sm mx-auto">
        <Countdown />
      </div>

      {/* Stats Grid — asymmetric bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard
          Icon={CheckCircle2}
          label={t("dashboard.stats.tasks")}
          value={`${taskPercent}%`}
          subtitle={`${doneTasks} / ${totalTasks}`}
          color="mint"
        />
        <StatCard
          Icon={PiggyBank}
          label={t("dashboard.stats.savings")}
          value={<Money amount={currentSavings} from="JPY" />}
          subtitle={t("dashboard.stats.savingsTarget")}
          color="marigold"
          className="md:col-span-2 lg:col-span-2"
        />
        <StatCard
          Icon={FileCheck}
          label={t("dashboard.stats.visa")}
          value={`${t("dashboard.stats.phase")} ${currentPhase}`}
          subtitle={`${t(phaseKeys[currentPhase])} · ${visaPercent}%`}
          color="lavender"
        />
      </div>

      {/* Progress */}
      <div className="glass space-y-5">
        <ProgressBar value={taskPercent} label={t("dashboard.progress.overall")} />
        <ProgressBar value={savingsPercent} label={t("dashboard.progress.savings")} />
        <ProgressBar value={visaPercent} label={t("dashboard.progress.visa")} />
      </div>

      <EncouragementBanner />

      {/* Upcoming Deadlines */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("dashboard.deadlines.title")}</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("dashboard.deadlines.empty")}</p>
        ) : (
          <div className="space-y-2 stagger">
            {upcoming.map((task) => (
              <Link
                key={task.id}
                href={`/checklist?task=${task.id}`}
                className="glass card-hover flex items-center justify-between !py-3 !px-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="pill pill-muted text-[11px] font-bold tabular-nums">{task.id}</span>
                  <div>
                    <p className="text-sm font-medium leading-relaxed">{task.title}</p>
                    <p className={`flex items-center gap-1 text-xs mt-0.5 ${isNaN(new Date(task.deadline!).getTime()) ? "text-coral-foreground font-medium" : "text-muted-foreground"}`}>
                      <Clock size={11} />
                      {isNaN(new Date(task.deadline!).getTime())
                        ? task.deadline
                        : new Date(task.deadline!).toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                          })
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`pill bounce-in ${
                      task.priority === "critical"
                        ? "pill-coral"
                        : task.priority === "high"
                        ? "pill-marigold"
                        : "pill-muted"
                    }`}
                  >
                    {t(`priority.${task.priority}`)}
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
