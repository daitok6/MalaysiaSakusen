"use client";

import { useLocale } from "./locale-provider";
import type { VisaStep, VisaStepStatus } from "@/lib/types";

const statusDotColors: Record<VisaStepStatus, string> = {
  pending: "bg-muted-foreground/30",
  in_progress: "bg-deep-purple",
  completed: "bg-mint",
  blocked: "bg-coral",
};

const statusPills: Record<VisaStepStatus, string> = {
  pending: "pill-muted",
  in_progress: "pill-lavender",
  completed: "pill-mint",
  blocked: "pill-coral",
};

type VisaTimelineProps = {
  steps: VisaStep[];
  onToggle: (id: string, status: VisaStepStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
};

export function VisaTimeline({ steps, onToggle, onNotesChange }: VisaTimelineProps) {
  const { t } = useLocale();
  const phases = ["A", "B", "C", "D"] as const;

  const phaseInfo: Record<string, { labelKey: string; periodKey: string }> = {
    A: { labelKey: "visa.phase.a", periodKey: "visa.phase.a.period" },
    B: { labelKey: "visa.phase.b", periodKey: "visa.phase.b.period" },
    C: { labelKey: "visa.phase.c", periodKey: "visa.phase.c.period" },
    D: { labelKey: "visa.phase.d", periodKey: "visa.phase.d.period" },
  };

  const statusLabelKeys: Record<VisaStepStatus, string> = {
    pending: "visa.status.pending",
    in_progress: "visa.status.in_progress",
    completed: "visa.status.completed",
    blocked: "visa.status.blocked",
  };

  return (
    <div className="space-y-8">
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase).sort((a, b) => a.sortOrder - b.sortOrder);
        const info = phaseInfo[phase];
        const completed = phaseSteps.filter((s) => s.status === "completed").length;
        const fillPercent = phaseSteps.length > 0 ? (completed / phaseSteps.length) * 100 : 0;

        return (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-deep-purple/20 text-deep-purple flex items-center justify-center font-bold text-sm">
                {phase}
              </div>
              <div>
                <h3 className="font-bold text-sm">{t(info.labelKey)}</h3>
                <p className="text-xs text-muted-foreground">
                  {t(info.periodKey)} · {completed}/{phaseSteps.length} {t("visa.done")}
                </p>
              </div>
            </div>

            <div className="ml-2 pl-4 sm:ml-4 sm:pl-6 space-y-3 relative">
              {/* Background line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted" />
              {/* Filled line */}
              <div
                className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-deep-purple to-mint transition-all duration-700 ease-out"
                style={{ height: `${fillPercent}%` }}
              />

              {phaseSteps.map((step) => {
                const nextStatus: VisaStepStatus =
                  step.status === "pending"
                    ? "in_progress"
                    : step.status === "in_progress"
                    ? "completed"
                    : step.status === "completed"
                    ? "pending"
                    : "pending";

                return (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute -left-[27px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background ${statusDotColors[step.status]} transition-colors duration-300`}
                    />
                    <div className={`glass card-hover ${step.status === "completed" ? "opacity-50" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm leading-relaxed ${step.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {step.title}
                          </p>
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("task.due")} {new Date(step.dueDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onToggle(step.id, nextStatus)}
                          className={`pill ${statusPills[step.status]} cursor-pointer hover:opacity-70 transition-opacity bounce-in`}
                        >
                          {t(statusLabelKeys[step.status])}
                        </button>
                      </div>
                      <textarea
                        className="mt-2 w-full text-xs bg-white/30 border border-white/20 rounded-xl px-3 py-2 resize-none placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-lavender/30 backdrop-blur-sm"
                        placeholder={t("visa.notes.placeholder")}
                        rows={1}
                        value={step.notes || ""}
                        onChange={(e) => onNotesChange(step.id, e.target.value)}
                        onFocus={(e) => { e.target.rows = 3; }}
                        onBlur={(e) => { if (!e.target.value) e.target.rows = 1; }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
