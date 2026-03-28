"use client";

import { useState, useEffect, useRef } from "react";
import { VisaTimeline } from "@/components/visa-timeline";
import { DocumentChecklist } from "@/components/document-checklist";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/locale-provider";
import type { VisaStep, VisaStepStatus, TrackerDocument, DocumentStatus } from "@/lib/types";

const APPLICATION_DATE = new Date("2026-08-15");

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
        <p className="text-muted-foreground">{t("visa.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("visa.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("visa.subtitle")}
        </p>
      </div>

      {daysUntilApp !== null && (
        <Card className="bg-gradient-to-r from-navy/5 to-primary/5 border-navy/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("visa.countdown.label")}</p>
              <p className="text-3xl font-bold text-navy">{daysUntilApp}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("visa.countdown.target")}</p>
            </div>
            <span className="text-4xl">📄</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
