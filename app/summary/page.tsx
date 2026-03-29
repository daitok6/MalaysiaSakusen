"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { TiltCard } from "@/components/tilt-card";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { useLocale } from "@/components/locale-provider";
import {
  CheckCircle2, Circle, ArrowRight, AlertTriangle,
  CalendarDays, FileCheck, FolderOpen, Flag, CircleMinus,
} from "lucide-react";
import type { Task, SavingsEntry, VisaStep, TrackerDocument } from "@/lib/types";

type PhaseInfo = {
  key: string;
  periodKey: string;
  steps: VisaStep[];
};

export default function SummaryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [documents, setDocuments] = useState<TrackerDocument[]>([]);
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
        setDocuments(visaData.documents || []);
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

  const categories = [
    { key: "visa", labelKey: "checklist.category.visa", tasks: tasks.filter((t) => t.category === "visa") },
    { key: "income", labelKey: "checklist.category.income", tasks: tasks.filter((t) => t.category === "income") },
    { key: "business", labelKey: "checklist.category.business", tasks: tasks.filter((t) => t.category === "business") },
    { key: "life", labelKey: "checklist.category.life", tasks: tasks.filter((t) => t.category === "life") },
    { key: "tech", labelKey: "checklist.category.tech", tasks: tasks.filter((t) => t.category === "tech") },
  ];

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const completedVisaSteps = visaSteps.filter((s) => s.status === "completed").length;
  const visaPercent = visaSteps.length > 0 ? Math.round((completedVisaSteps / visaSteps.length) * 100) : 0;
  const docsReady = documents.filter((d) => d.status === "ready").length;

  const phases: PhaseInfo[] = [
    { key: "a", periodKey: "visa.phase.a.period", steps: visaSteps.filter((s) => s.phase === "A") },
    { key: "b", periodKey: "visa.phase.b.period", steps: visaSteps.filter((s) => s.phase === "B") },
    { key: "c", periodKey: "visa.phase.c.period", steps: visaSteps.filter((s) => s.phase === "C") },
    { key: "d", periodKey: "visa.phase.d.period", steps: visaSteps.filter((s) => s.phase === "D") },
  ];

  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "done"
  );
  const criticalPending = tasks.filter(
    (t) => t.priority === "critical" && t.status !== "done"
  );

  const milestones = [
    { date: "2026-04-15", en: "Register marriage", ja: "婚姻届提出" },
    { date: "2026-04-30", en: "First side income payment", ja: "初副収入" },
    { date: "2026-06-30", en: "¥225K savings milestone", ja: "貯金¥225K達成" },
    { date: "2026-08-01", en: "August checkpoint gate", ja: "8月チェックポイント" },
    { date: "2026-08-15", en: "Submit DE Rantau application", ja: "DE Rantau申請提出" },
    { date: "2026-09-15", en: "Visa approval expected", ja: "ビザ承認予定" },
    { date: "2026-10-15", en: "Submit resignation & 転出届", ja: "退職届・転出届提出" },
    { date: "2026-11-01", en: "Arrive in Kuala Lumpur!", ja: "クアラルンプール到着！" },
  ];

  const today = new Date();
  const nextMilestone = milestones.find((m) => new Date(m.date) > today);

  const pillColors = ["pill-lavender", "pill-mint", "pill-marigold", "pill-coral"];

  // Find the highest-progress stat for "pop forward" effect
  const statValues = [taskPercent, savingsPercent, visaPercent];
  const maxStatIdx = statValues.indexOf(Math.max(...statValues));

  return (
    <div className="space-y-10">
      {/* Mascot Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/mascots.splinecode"
          fallbackSrc="/illustrations/mascots.svg"
          fallbackAlt="Mascot pair celebrating progress"
        >
          <div className="space-y-2 px-4">
            <p className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter gradient-text opacity-30">
              {taskPercent}%
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter gradient-text">
              {t("summary.title")}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{t("summary.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Big Numbers — depth effect on highest */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger">
        <TiltCard className={`text-center ${maxStatIdx === 0 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-2xl sm:text-4xl font-bold tracking-tighter gradient-text">{taskPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.tasksComplete")}</p>
        </TiltCard>
        <TiltCard className={`text-center ${maxStatIdx === 1 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-2xl sm:text-4xl font-bold tracking-tighter gradient-text">{savingsPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.savingsProgress")}</p>
        </TiltCard>
        <TiltCard className={`text-center ${maxStatIdx === 2 ? "scale-105 shadow-xl" : ""}`}>
          <p className="text-2xl sm:text-4xl font-bold tracking-tighter gradient-text">{visaPercent}%</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.visaProgress")}</p>
        </TiltCard>
        <TiltCard className="text-center">
          <p className="text-2xl sm:text-4xl font-bold tracking-tighter gradient-text">{docsReady}/{documents.length}</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">{t("summary.docsReady")}</p>
        </TiltCard>
      </div>

      {/* Checklist Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.checklistBreakdown")}</h2>
          <Link href="/checklist" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="glass space-y-4">
          {categories.map((cat) => {
            const done = cat.tasks.filter((t) => t.status === "done").length;
            const percent = cat.tasks.length > 0 ? Math.round((done / cat.tasks.length) * 100) : 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{t(cat.labelKey)}</span>
                  <span className="text-muted-foreground text-xs font-bold tabular-nums">{done}/{cat.tasks.length}</span>
                </div>
                <ProgressBar value={percent} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Finances */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.financesOverview")}</h2>
          <Link href="/finances" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TiltCard>
            <p className="text-xs text-muted-foreground font-medium">{t("summary.currentSavings")}</p>
            <p className="text-3xl font-bold tracking-tight mt-2">
              <Money amount={currentSavings} from="JPY" />
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("finances.target")} <Money amount={savingsTarget} from="JPY" />
            </p>
            <div className="mt-4">
              <ProgressBar value={savingsPercent} />
            </div>
          </TiltCard>
          <TiltCard>
            <p className="text-xs text-muted-foreground font-medium">{t("summary.augustCheckpoint")}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("finances.checkpoint.savings")}</span>
                {currentSavings >= 400000 ? (
                  <CheckCircle2 size={18} className="text-mint-foreground" />
                ) : (
                  <CircleMinus size={18} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("finances.checkpoint.income")}</span>
                <CircleMinus size={18} className="text-muted-foreground" />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Visa Phases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight slide-in-left">{t("summary.visaPhases")}</h2>
          <Link href="/visa" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {t("summary.viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {phases.map((phase, i) => {
            const completed = phase.steps.filter((s) => s.status === "completed").length;
            const percent = phase.steps.length > 0 ? Math.round((completed / phase.steps.length) * 100) : 0;
            const isActive = phase.steps.some((s) => s.status === "in_progress");
            return (
              <TiltCard
                key={phase.key}
                className={isActive ? "border-lavender/50" : ""}
              >
                <span className={`pill bounce-in ${pillColors[i]}`}>{t(`visa.phase.${phase.key}`)}</span>
                <p className="text-xs text-muted-foreground mt-2">{t(phase.periodKey)}</p>
                <p className="text-2xl font-bold tracking-tighter mt-2 gradient-text">{percent}%</p>
                <p className="text-xs text-muted-foreground mt-1">{completed}/{phase.steps.length} {t("summary.stepsComplete")}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 slide-in-left">
          <FolderOpen size={16} className="text-marigold-foreground" />
          <h2 className="text-lg font-bold tracking-tight">{t("summary.documentsStatus")}</h2>
        </div>
        <div className="glass">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc, i) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-sm truncate mr-3 leading-relaxed">{doc.name}</span>
                <span
                  className={`pill shrink-0 bounce-in ${
                    doc.status === "ready"
                      ? "pill-mint"
                      : doc.status === "in_progress"
                      ? "pill-sky"
                      : "pill-muted"
                  }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {doc.status === "ready"
                    ? t("visa.docs.readyStatus")
                    : doc.status === "in_progress"
                    ? t("visa.docs.inProgress")
                    : t("visa.docs.notStarted")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 slide-in-left">
          <CalendarDays size={16} className="text-lavender-foreground" />
          <h2 className="text-lg font-bold tracking-tight">{t("summary.keyMilestones")}</h2>
        </div>
        <div className="glass">
          {milestones.map((m, i) => {
            const date = new Date(m.date);
            const isPast = date < today;
            const isNext = nextMilestone?.date === m.date;
            return (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0">
                <div className="flex flex-col items-center shrink-0 w-12">
                  <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                    {date.toLocaleDateString("ja-JP", { month: "short" })}
                  </span>
                  <span className="text-sm font-bold tabular-nums">{date.getDate()}</span>
                </div>
                <div className={`flex-1 ${isPast ? "opacity-40" : ""}`}>
                  <p className="text-sm font-medium leading-relaxed">
                    {t("summary.locale") === "ja" ? m.ja : m.en}
                  </p>
                </div>
                {isPast ? (
                  <CheckCircle2 size={16} className="text-mint-foreground shrink-0" />
                ) : isNext ? (
                  <span className="pill pill-coral shrink-0 bounce-in">{t("summary.next")}</span>
                ) : (
                  <Circle size={16} className="text-muted-foreground/30 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      {(overdueTasks.length > 0 || criticalPending.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 slide-in-left">
            <Flag size={16} className="text-coral-foreground" />
            <h2 className="text-lg font-bold tracking-tight">{t("summary.actionItems")}</h2>
          </div>

          {overdueTasks.length > 0 && (
            <div className="glass glow-coral border-coral/30">
              <p className="flex items-center gap-1.5 text-xs text-coral-foreground font-bold mb-3">
                <AlertTriangle size={13} />
                {t("summary.overdue")}
              </p>
              <div className="space-y-2">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm leading-relaxed">
                      <span className="text-xs text-muted-foreground mr-1.5 font-bold tabular-nums">{task.id}</span>
                      {task.title}
                    </span>
                    <span className="pill pill-coral text-[10px]">
                      {new Date(task.deadline!).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {criticalPending.length > 0 && (
            <div className="glass">
              <p className="text-xs text-muted-foreground font-bold mb-3">{t("summary.criticalPending")}</p>
              <div className="space-y-2">
                {criticalPending.slice(0, 8).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm leading-relaxed">
                      <span className="text-xs text-muted-foreground mr-1.5 font-bold tabular-nums">{task.id}</span>
                      {task.title}
                    </span>
                    <span className={`pill bounce-in ${task.status === "in_progress" ? "pill-lavender" : "pill-muted"}`}>
                      {t(`status.${task.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
