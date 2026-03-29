"use client";

import { useLocale } from "./locale-provider";
import { FolderOpen } from "lucide-react";
import type { TrackerDocument, DocumentStatus } from "@/lib/types";

type DocumentChecklistProps = {
  documents: TrackerDocument[];
  onStatusChange: (id: string, status: DocumentStatus) => void;
};

const statusPills: Record<DocumentStatus, string> = {
  not_started: "pill-muted",
  in_progress: "pill-sky",
  ready: "pill-mint",
};

const statusLabelKeys: Record<DocumentStatus, string> = {
  not_started: "visa.docs.notStarted",
  in_progress: "visa.docs.inProgress",
  ready: "visa.docs.readyStatus",
};

export function DocumentChecklist({ documents, onStatusChange }: DocumentChecklistProps) {
  const { t } = useLocale();
  const ready = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-marigold-foreground" />
          <h3 className="font-bold text-sm">{t("visa.docs.title")}</h3>
        </div>
        <span className="text-xs text-muted-foreground font-bold tabular-nums">
          {ready}/{documents.length} {t("visa.docs.ready")}
        </span>
      </div>
      <div className="space-y-2">
        {documents.map((doc, i) => {
          const nextStatus: DocumentStatus =
            doc.status === "not_started"
              ? "in_progress"
              : doc.status === "in_progress"
              ? "ready"
              : "not_started";

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0 fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className={`text-sm leading-relaxed ${doc.status === "ready" ? "line-through text-muted-foreground" : ""}`}>
                {doc.name}
              </span>
              <button
                onClick={() => onStatusChange(doc.id, nextStatus)}
                className={`pill ${statusPills[doc.status]} cursor-pointer hover:opacity-70 transition-opacity shrink-0 ml-3 bounce-in`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {t(statusLabelKeys[doc.status])}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
