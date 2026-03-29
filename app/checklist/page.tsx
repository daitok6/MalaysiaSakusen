"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { FileText, Coins, Rocket, Home, Monitor, ListChecks, ArrowUpDown } from "lucide-react";
import type { Task, TaskCategory, TaskStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

const categories: { value: TaskCategory | "all"; labelKey: string; Icon: LucideIcon }[] = [
  { value: "all", labelKey: "checklist.category.all", Icon: ListChecks },
  { value: "visa", labelKey: "checklist.category.visa", Icon: FileText },
  { value: "income", labelKey: "checklist.category.income", Icon: Coins },
  { value: "business", labelKey: "checklist.category.business", Icon: Rocket },
  { value: "life", labelKey: "checklist.category.life", Icon: Home },
  { value: "tech", labelKey: "checklist.category.tech", Icon: Monitor },
];

type SortOption = "default" | "priority" | "deadline" | "status" | "name";

const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const statusOrder: Record<string, number> = { in_progress: 0, todo: 1, done: 2 };

function sortTasks(tasks: Task[], sort: SortOption): Task[] {
  if (sort === "default") return tasks;
  return [...tasks].sort((a, b) => {
    switch (sort) {
      case "priority":
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "deadline": {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        const aIsDate = !isNaN(new Date(a.deadline).getTime());
        const bIsDate = !isNaN(new Date(b.deadline).getTime());
        if (!aIsDate && bIsDate) return -1;
        if (aIsDate && !bIsDate) return 1;
        if (!aIsDate && !bIsDate) return 0;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      case "status":
        return statusOrder[a.status] - statusOrder[b.status];
      case "name":
        return a.title.localeCompare(b.title, "ja");
      default:
        return 0;
    }
  });
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [highlightedTask, setHighlightedTask] = useState<string | null>(null);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { t } = useLocale();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Handle ?task=V1 query param — switch to correct tab and scroll to task
  useEffect(() => {
    const taskId = searchParams.get("task");
    if (!taskId || tasks.length === 0) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Switch to the "all" tab so we can always find the task
    setActiveTab("all");
    setHighlightedTask(taskId);

    // Scroll to the task after tab switch renders
    setTimeout(() => {
      const el = taskRefs.current[taskId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);

    // Remove highlight after 3 seconds
    const timer = setTimeout(() => setHighlightedTask(null), 3000);
    return () => clearTimeout(timer);
  }, [searchParams, tasks]);

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

  const sortLabels: Record<SortOption, string> = {
    default: "デフォルト",
    priority: "優先度",
    deadline: "締切日",
    status: "ステータス",
    name: "名前",
  };

  return (
    <div className="space-y-8">
      {/* Clipboard Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/clipboard.splinecode"
          fallbackSrc="/illustrations/clipboard.svg"
          fallbackAlt="3D floating clipboard"
        >
          <div className="space-y-2 px-4">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("checklist.title")}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{t("checklist.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Filter toggle for mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass text-sm font-medium w-full text-center cursor-pointer"
        >
          {showFilters ? t("checklist.hideFilters") : t("checklist.showFilters")}
        </button>
      </div>

      {/* Filters — collapsible on mobile */}
      <div className={`flex gap-2 flex-wrap ${showFilters ? "" : "hidden md:flex"}`}>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allStatus")}</SelectItem>
            <SelectItem value="todo">{t("status.todo")}</SelectItem>
            <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
            <SelectItem value="done">{t("status.done")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="担当者" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.everyone")}</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[130px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <SelectValue placeholder="優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("checklist.filter.allPriority")}</SelectItem>
            <SelectItem value="critical">{t("priority.critical")}</SelectItem>
            <SelectItem value="high">{t("priority.high")}</SelectItem>
            <SelectItem value="medium">{t("priority.medium")}</SelectItem>
            <SelectItem value="low">{t("priority.low")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs rounded-xl border-white/20 bg-white/50 backdrop-blur-sm cursor-pointer">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={12} />
              <SelectValue placeholder="並べ替え" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(sortLabels) as SortOption[]).map((key) => (
              <SelectItem key={key} value={key}>{sortLabels[key]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Floating pill tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl gap-0.5 sm:gap-1 p-1 sm:p-1.5 flex-nowrap">
          {categories.map((cat) => {
            const catTasks = cat.value === "all" ? tasks : tasks.filter((t) => t.category === cat.value);
            const done = catTasks.filter((t) => t.status === "done").length;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="text-[11px] sm:text-xs rounded-xl data-[state=active]:bg-white/70 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-4 py-1.5 sm:py-2 gap-1 sm:gap-1.5 cursor-pointer transition-all shrink-0 whitespace-nowrap"
              >
                <cat.Icon size={14} />
                <span className="hidden sm:inline">{t(cat.labelKey)}</span>
                <span className="font-bold tabular-nums opacity-60">{done}/{catTasks.length}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const catTasks = cat.value === "all" ? tasks : tasks.filter((task) => task.category === cat.value);
          const filtered = sortTasks(filterTasks(catTasks), sortBy);
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
                    <div
                      key={task.id}
                      ref={(el) => { taskRefs.current[task.id] = el; }}
                      className={`transition-all duration-500 ${
                        highlightedTask === task.id
                          ? "ring-2 ring-lavender ring-offset-2 rounded-2xl"
                          : ""
                      }`}
                    >
                      <TaskCard
                        task={task}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
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
