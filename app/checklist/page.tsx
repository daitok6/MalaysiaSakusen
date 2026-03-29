"use client";

import { useState, useEffect, useMemo } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
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
import { FileText, Coins, Rocket, Home, Monitor } from "lucide-react";
import type { Task, TaskCategory, TaskStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

const categories: { value: TaskCategory; labelKey: string; Icon: LucideIcon }[] = [
  { value: "visa", labelKey: "checklist.category.visa", Icon: FileText },
  { value: "income", labelKey: "checklist.category.income", Icon: Coins },
  { value: "business", labelKey: "checklist.category.business", Icon: Rocket },
  { value: "life", labelKey: "checklist.category.life", Icon: Home },
  { value: "tech", labelKey: "checklist.category.tech", Icon: Monitor },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
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
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Clipboard Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/clipboard.splinecode"
          fallbackSrc="/illustrations/clipboard.svg"
          fallbackAlt="3D floating clipboard"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("checklist.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("checklist.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Filter toggle for mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass text-sm font-medium w-full text-center cursor-pointer"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters — collapsible on mobile */}
      <div className={`flex gap-2 flex-wrap ${showFilters ? "" : "hidden md:flex"}`}>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
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
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.everyone")}</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
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

      {/* Floating pill tabs */}
      <Tabs defaultValue="visa">
        <TabsList className="w-full justify-start overflow-x-auto bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl gap-1 p-1.5">
          {categories.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat.value);
            const done = catTasks.filter((t) => t.status === "done").length;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="text-xs rounded-xl data-[state=active]:bg-white/70 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-4 py-2 gap-1.5 cursor-pointer transition-all"
              >
                <cat.Icon size={14} />
                {t(cat.labelKey)}
                <span className="ml-1 font-bold tabular-nums opacity-60">{done}/{catTasks.length}</span>
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
            <TabsContent key={cat.value} value={cat.value} className="space-y-4 mt-6">
              <ProgressBar value={percent} label={t(cat.labelKey)} />

              {percent === 100 && (
                <div className="glass text-center relative sparkle overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: "linear-gradient(135deg, rgba(167,232,189,0.4) 0%, rgba(184,181,255,0.2) 100%)",
                    }}
                  />
                  <p className="relative font-bold">{t("checklist.complete")}</p>
                </div>
              )}

              <div className="space-y-2 stagger">
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
