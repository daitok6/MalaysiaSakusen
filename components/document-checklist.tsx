"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackerDocument, DocumentStatus } from "@/lib/types";

const statusStyles: Record<DocumentStatus, { bg: string; text: string; label: string }> = {
  not_started: { bg: "bg-muted", text: "text-muted-foreground", label: "Not Started" },
  in_progress: { bg: "bg-gold/20", text: "text-amber-700", label: "In Progress" },
  ready: { bg: "bg-success/15", text: "text-success", label: "Ready" },
};

type DocumentChecklistProps = {
  documents: TrackerDocument[];
  onStatusChange: (id: string, status: DocumentStatus) => void;
};

export function DocumentChecklist({ documents, onStatusChange }: DocumentChecklistProps) {
  const ready = documents.filter((d) => d.status === "ready").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-navy flex items-center justify-between">
          <span>📁 Required Documents</span>
          <span className="text-sm font-normal text-muted-foreground">
            {ready}/{documents.length} ready
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => {
          const style = statusStyles[doc.status];
          const nextStatus: DocumentStatus =
            doc.status === "not_started"
              ? "in_progress"
              : doc.status === "in_progress"
              ? "ready"
              : "not_started";

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {doc.status === "ready" ? "✅" : doc.status === "in_progress" ? "🟡" : "⭕"}
                </span>
                <span className={`text-sm ${doc.status === "ready" ? "line-through text-muted-foreground" : "text-navy"}`}>
                  {doc.name}
                </span>
              </div>
              <button onClick={() => onStatusChange(doc.id, nextStatus)}>
                <Badge className={`${style.bg} ${style.text} border-0 cursor-pointer hover:opacity-80 text-xs`}>
                  {style.label}
                </Badge>
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
