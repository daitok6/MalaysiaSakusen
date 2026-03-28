"use client";

import { Badge } from "@/components/ui/badge";
import type { VisaStep, VisaStepStatus } from "@/lib/types";

const phaseInfo: Record<string, { label: string; period: string }> = {
  A: { label: "Foundation", period: "Apr–Jun 2026" },
  B: { label: "Income Building", period: "May–Aug 2026" },
  C: { label: "Visa Application", period: "Aug–Sep 2026" },
  D: { label: "Relocation", period: "Oct–Nov 2026" },
};

const statusStyles: Record<VisaStepStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" },
  in_progress: { bg: "bg-gold/20", text: "text-amber-700", label: "In Progress" },
  completed: { bg: "bg-success/15", text: "text-success", label: "Completed" },
  blocked: { bg: "bg-primary/15", text: "text-primary", label: "Blocked" },
};

const statusDotColors: Record<VisaStepStatus, string> = {
  pending: "bg-muted-foreground/30",
  in_progress: "bg-gold",
  completed: "bg-success",
  blocked: "bg-primary",
};

type VisaTimelineProps = {
  steps: VisaStep[];
  onToggle: (id: string, status: VisaStepStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
};

export function VisaTimeline({ steps, onToggle, onNotesChange }: VisaTimelineProps) {
  const phases = ["A", "B", "C", "D"] as const;

  return (
    <div className="space-y-8">
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase).sort((a, b) => a.sortOrder - b.sortOrder);
        const info = phaseInfo[phase];
        const completed = phaseSteps.filter((s) => s.status === "completed").length;

        return (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                {phase}
              </div>
              <div>
                <h3 className="font-bold text-navy">{info.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {info.period} • {completed}/{phaseSteps.length} done
                </p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-border pl-6 space-y-4">
              {phaseSteps.map((step) => {
                const style = statusStyles[step.status];
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
                      className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${statusDotColors[step.status]}`}
                    />

                    <div className={`rounded-lg border p-3 ${step.status === "completed" ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${step.status === "completed" ? "line-through text-muted-foreground" : "text-navy"}`}>
                            {step.title}
                          </p>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          )}
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {new Date(step.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onToggle(step.id, nextStatus)}
                          className="shrink-0"
                        >
                          <Badge className={`${style.bg} ${style.text} border-0 cursor-pointer hover:opacity-80`}>
                            {style.label}
                          </Badge>
                        </button>
                      </div>

                      <textarea
                        className="mt-2 w-full text-xs bg-transparent border border-border rounded px-2 py-1 resize-none placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="Add notes..."
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
