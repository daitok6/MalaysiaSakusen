"use client";

import { useLocale } from "./locale-provider";
import { AlertTriangle, Clock, Link2 } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";

const priorityPills: Record<string, string> = {
  critical: "pill-coral",
  high: "pill-marigold",
  medium: "pill-sky",
  low: "pill-muted",
};

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-lavender/30 text-lavender-foreground",
  done: "bg-mint/40 text-mint-foreground",
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const { t } = useLocale();
  const isDateDeadline = task.deadline && !isNaN(new Date(task.deadline).getTime());
  const isOverdue = isDateDeadline && new Date(task.deadline!) < new Date() && task.status !== "done";
  const isAsap = task.deadline && !isDateDeadline;
  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

  const statusLabels: Record<TaskStatus, string> = {
    todo: t("status.todo"),
    in_progress: t("status.in_progress"),
    done: t("status.done"),
  };

  return (
    <div className={`glass card-hover transition-all ${task.status === "done" ? "opacity-50" : ""} ${isOverdue ? "border-coral/50 glow-coral" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`pill bounce-in ${priorityPills[task.priority]}`}>
              {t(`priority.${task.priority}`)}
            </span>
            {task.assignee && (
              <span className="pill pill-blush bounce-in">{task.assignee}</span>
            )}
            {task.dependsOn && task.dependsOn.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Link2 size={11} />
                {task.dependsOn.join(", ")}
              </span>
            )}
          </div>
          <p className={`font-medium text-sm leading-relaxed ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
            <span className="text-muted-foreground mr-1.5 text-xs font-bold tabular-nums">{task.id}</span>
            {task.title}
          </p>
          {task.deadline && (
            <p className={`flex items-center gap-1 text-xs mt-1.5 ${isOverdue || isAsap ? "text-coral-foreground font-medium" : "text-muted-foreground"}`}>
              {isOverdue || isAsap ? <AlertTriangle size={12} /> : <Clock size={12} />}
              {isAsap
                ? task.deadline
                : isOverdue
                ? t("task.overdue") + " " + new Date(task.deadline).toLocaleDateString("ja-JP", { month: "short", day: "numeric", year: "numeric" })
                : t("task.due") + " " + new Date(task.deadline).toLocaleDateString("ja-JP", { month: "short", day: "numeric", year: "numeric" })
              }
            </p>
          )}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/20 shrink-0 backdrop-blur-sm">
          {statuses.map((s) => {
            const abbrevLabels: Record<TaskStatus, string> = {
              todo: "T",
              in_progress: "IP",
              done: "D",
            };
            return (
              <button
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                className={`px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                  task.status === s ? statusStyles[s] : "hover:bg-white/30"
                }`}
              >
                <span className="sm:hidden">{abbrevLabels[s]}</span>
                <span className="hidden sm:inline">{statusLabels[s]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
