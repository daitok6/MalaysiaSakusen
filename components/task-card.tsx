"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "./locale-provider";
import type { Task, TaskStatus } from "@/lib/types";

const priorityStyles: Record<string, string> = {
  critical: "bg-primary/15 text-primary border-primary/30",
  high: "bg-gold/15 text-amber-700 border-gold/30",
  medium: "bg-navy/10 text-navy border-navy/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-gold/20 text-amber-700",
  done: "bg-success/15 text-success",
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const { t } = useLocale();
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";
  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

  const statusLabels: Record<TaskStatus, string> = {
    todo: t("status.todo"),
    in_progress: t("status.in_progress"),
    done: t("status.done"),
  };

  return (
    <Card className={`transition-all ${task.status === "done" ? "opacity-60" : ""} ${isOverdue ? "border-primary/50" : ""}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className={`text-[10px] ${priorityStyles[task.priority]}`}>
                {t(`priority.${task.priority}`)}
              </Badge>
              {task.assignee && (
                <Badge variant="outline" className="text-[10px]">
                  {task.assignee}
                </Badge>
              )}
              {task.dependsOn && task.dependsOn.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {t("task.needs")} {task.dependsOn.join(", ")}
                </span>
              )}
            </div>
            <p className={`font-medium text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-navy"}`}>
              <span className="text-muted-foreground mr-1.5 font-mono text-xs">{task.id}</span>
              {task.title}
            </p>
            {task.deadline && (
              <p className={`text-xs mt-1 ${isOverdue ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {isOverdue ? t("task.overdue") + " " : t("task.due") + " "}
                {new Date(task.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex rounded-lg overflow-hidden border border-border shrink-0">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                className={`px-2 py-1 text-[10px] font-medium transition-colors ${
                  task.status === s ? statusStyles[s] : "hover:bg-muted/50"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
