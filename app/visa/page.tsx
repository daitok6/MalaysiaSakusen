"use client";

import { useState, useEffect, useRef } from "react";
import { ParallaxHero } from "@/components/parallax-hero";
import { CircularProgress } from "@/components/circular-progress";
import { TiltCard } from "@/components/tilt-card";
import { VisaTimeline } from "@/components/visa-timeline";
import { DocumentChecklist } from "@/components/document-checklist";
import { useLocale } from "@/components/locale-provider";
import { CalendarClock } from "lucide-react";
import type { VisaStep, VisaStepStatus, TrackerDocument, DocumentStatus } from "@/lib/types";

const APPLICATION_DATE = new Date("2026-08-15");
const TOTAL_DAYS = Math.ceil(
  (APPLICATION_DATE.getTime() - new Date("2026-03-28").getTime()) / (1000 * 60 * 60 * 24)
);

export default function VisaPage() {
  const [steps, setSteps] = useState<VisaStep[]>([]);
  const [documents, setDocuments] = useState<TrackerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysUntilApp, setDaysUntilApp] = useState<number | null>(null);
  const notesTimeout = useRef<Record<string, NodeJS.Timeout>>({});
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/visa")
      .then((r) => r.json())
      .then((data) => {
        setSteps(data.steps || []);
        setDocuments(data.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const diff = APPLICATION_DATE.getTime() - Date.now();
    setDaysUntilApp(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  const handleStepToggle = async (id: string, status: VisaStepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "step", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));

    if (notesTimeout.current[id]) clearTimeout(notesTimeout.current[id]);
    notesTimeout.current[id] = setTimeout(async () => {
      try {
        await fetch("/api/visa", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "step", id, notes }),
        });
      } catch {}
    }, 1000);
  };

  const handleDocStatusChange = async (id: string, status: DocumentStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "document", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  const daysElapsed = TOTAL_DAYS - (daysUntilApp ?? TOTAL_DAYS);
  const countdownPercent = Math.round((daysElapsed / TOTAL_DAYS) * 100);

  return (
    <div className="space-y-10">
      {/* Passport Hero */}
      <div className="-mx-6 -mt-10">
        <ParallaxHero
          sceneUrl="/scenes/passport.splinecode"
          fallbackSrc="/illustrations/passport.svg"
          fallbackAlt="3D passport with visa stamps"
        >
          <div className="space-y-2 px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
              {t("visa.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("visa.subtitle")}</p>
          </div>
        </ParallaxHero>
      </div>

      {/* Circular Countdown */}
      {daysUntilApp !== null && (
        <TiltCard className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("visa.countdown.label")}</p>
            <p className="text-xs text-muted-foreground mt-2">{t("visa.countdown.target")}</p>
          </div>
          <CircularProgress value={countdownPercent} size={100} strokeWidth={6}>
            <div className="text-center">
              <p className="text-2xl font-bold tracking-tighter gradient-text">{daysUntilApp}</p>
              <p className="text-[10px] text-muted-foreground">days</p>
            </div>
          </CircularProgress>
        </TiltCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VisaTimeline
            steps={steps}
            onToggle={handleStepToggle}
            onNotesChange={handleNotesChange}
          />
        </div>
        <div>
          <DocumentChecklist
            documents={documents}
            onStatusChange={handleDocStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
