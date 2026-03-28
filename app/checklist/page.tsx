"use client";

import { useState, useEffect, useMemo } from "react";
import { TaskCard } from "@/components/task-card";
import { ProgressBar } from "@/components/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/components/locale-provider";
import type { Task, TaskCategory, TaskStatus } from "@/lib/types";

const categories: { value: TaskCategory; labelKey: string; icon: string }[] = [
  { value: "visa", labelKey: "checklist.category.visa", icon: "📄" },
  { value: "income", labelKey: "checklist.category.income", icon: "💰" },
  { value: "business", labelKey: "checklist.category.business", icon: "🚀" },
  { value: "life", labelKey: "checklist.category.life", icon: "🏠" },
  { value: "tech", labelKey: "checklist.category.tech", icon: "💻" },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const userName = localStorage.getItem("sakusen-user") || "Unknown";
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedBy: userName, updatedAt: new Date().toISOString() } : t
      )
    );
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, updatedBy: userName }),
      });
      const updated = await res.json();
      setTasks(updated);
    } catch {
      fetch("/api/tasks").then((r) => r.json()).then(setTasks);
    }
  };

  const assignees = useMemo(() => {
    const set = new Set(tasks.map((t) => t.assignee).filter(Boolean));
    return Array.from(set) as string[];
  }, [tasks]);

  const filterTasks = (categoryTasks: Task[]) => {
    return categoryTasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">{t("checklist.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("checklist.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("checklist.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allStatus")}</SelectItem>
            <SelectItem value="todo">{t("status.todo")}</SelectItem>
            <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
            <SelectItem value="done">{t("status.done")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.everyone")}</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allPriority")}</SelectItem>
            <SelectItem value="critical">{t("priority.critical")}</SelectItem>
            <SelectItem value="high">{t("priority.high")}</SelectItem>
            <SelectItem value="medium">{t("priority.medium")}</SelectItem>
            <SelectItem value="low">{t("priority.low")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="visa">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat.value);
            const done = catTasks.filter((t) => t.status === "done").length;
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                <span className="mr-1">{cat.icon}</span>
                {t(cat.labelKey)}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {done}/{catTasks.length}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const catTasks = tasks.filter((task) => task.category === cat.value);
          const filtered = filterTasks(catTasks);
          const done = catTasks.filter((task) => task.status === "done").length;
          const percent = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;

          return (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4 mt-4">
              <ProgressBar value={percent} label={`${t(cat.labelKey)} Progress`} />

              {percent === 100 && (
                <div className="text-center py-4 rounded-xl bg-success/10 border border-success/30">
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="font-bold text-success">{t("checklist.complete")}</p>
                </div>
              )}

              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    {t("checklist.empty")}
                  </p>
                ) : (
                  filtered.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
