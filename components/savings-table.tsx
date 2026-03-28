"use client";

import { useState } from "react";
import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SavingsEntry } from "@/lib/types";

type SavingsTableProps = {
  savings: SavingsEntry[];
  onUpdate: (month: string, field: string, value: number) => void;
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  return `${monthNames[parseInt(m) - 1]} ${year}`;
}

export function SavingsTable({ savings, onUpdate }: SavingsTableProps) {
  const [editing, setEditing] = useState<{ month: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const { t } = useLocale();

  const startEdit = (month: string, field: string, currentValue?: number) => {
    setEditing({ month, field });
    setEditValue(currentValue?.toString() ?? "");
  };

  const commitEdit = () => {
    if (!editing) return;
    const num = parseInt(editValue) || 0;
    onUpdate(editing.month, editing.field, num);
    setEditing(null);
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("finances.table.month")}</TableHead>
              <TableHead className="text-right">{t("finances.table.salaryProjected")}</TableHead>
              <TableHead className="text-right">{t("finances.table.salaryActual")}</TableHead>
              <TableHead className="text-right">{t("finances.table.sideProjected")}</TableHead>
              <TableHead className="text-right">{t("finances.table.sideActual")}</TableHead>
              <TableHead className="text-right">{t("finances.table.cumProjected")}</TableHead>
              <TableHead className="text-right">{t("finances.table.cumActual")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savings.map((entry) => {
              const actualCumulative = (entry.actualSalary ?? 0) + (entry.actualSideIncome ?? 0);
              return (
                <TableRow key={entry.month}>
                  <TableCell className="font-medium">{formatMonth(entry.month)}</TableCell>
                  <TableCell className="text-right">
                    <Money amount={entry.projectedSalary} from="JPY" />
                  </TableCell>
                  <TableCell
                    className="text-right cursor-pointer hover:bg-muted/50 rounded"
                    onClick={() => startEdit(entry.month, "actualSalary", entry.actualSalary)}
                  >
                    {editing?.month === entry.month && editing.field === "actualSalary" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className={entry.actualSalary ? "text-navy font-medium" : "text-muted-foreground"}>
                        {entry.actualSalary ? (
                          <Money amount={entry.actualSalary} from="JPY" />
                        ) : (
                          t("finances.table.clickEdit")
                        )}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={entry.projectedSideIncome} from="JPY" />
                  </TableCell>
                  <TableCell
                    className="text-right cursor-pointer hover:bg-muted/50 rounded"
                    onClick={() => startEdit(entry.month, "actualSideIncome", entry.actualSideIncome)}
                  >
                    {editing?.month === entry.month && editing.field === "actualSideIncome" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className={entry.actualSideIncome ? "text-navy font-medium" : "text-muted-foreground"}>
                        {entry.actualSideIncome ? (
                          <Money amount={entry.actualSideIncome} from="JPY" />
                        ) : (
                          t("finances.table.clickEdit")
                        )}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={entry.projectedCumulative} from="JPY" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {actualCumulative > 0 ? (
                      <Money amount={actualCumulative} from="JPY" className="text-navy" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {savings.map((entry) => {
          const actualCumulative = (entry.actualSalary ?? 0) + (entry.actualSideIncome ?? 0);
          return (
            <div key={entry.month} className="border border-border rounded-lg p-3 bg-card">
              <p className="font-semibold text-navy mb-2">{formatMonth(entry.month)}</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("finances.table.salaryProjected")}</span>
                  <div className="flex items-center gap-2">
                    <Money amount={entry.projectedSalary} from="JPY" />
                    <span
                      className="cursor-pointer text-muted-foreground hover:text-navy transition-colors"
                      onClick={() => startEdit(entry.month, "actualSalary", entry.actualSalary)}
                    >
                      →
                    </span>
                    {editing?.month === entry.month && editing.field === "actualSalary" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`cursor-pointer ${entry.actualSalary ? "text-navy font-medium" : "text-muted-foreground"}`}
                        onClick={() => startEdit(entry.month, "actualSalary", entry.actualSalary)}
                      >
                        {entry.actualSalary ? (
                          <Money amount={entry.actualSalary} from="JPY" />
                        ) : (
                          t("finances.table.clickEdit")
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("finances.table.sideProjected")}</span>
                  <div className="flex items-center gap-2">
                    <Money amount={entry.projectedSideIncome} from="JPY" />
                    <span
                      className="cursor-pointer text-muted-foreground hover:text-navy transition-colors"
                      onClick={() => startEdit(entry.month, "actualSideIncome", entry.actualSideIncome)}
                    >
                      →
                    </span>
                    {editing?.month === entry.month && editing.field === "actualSideIncome" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`cursor-pointer ${entry.actualSideIncome ? "text-navy font-medium" : "text-muted-foreground"}`}
                        onClick={() => startEdit(entry.month, "actualSideIncome", entry.actualSideIncome)}
                      >
                        {entry.actualSideIncome ? (
                          <Money amount={entry.actualSideIncome} from="JPY" />
                        ) : (
                          t("finances.table.clickEdit")
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-1.5 mt-1.5">
                  <span className="text-muted-foreground">{t("finances.table.cumProjected")}</span>
                  <Money amount={entry.projectedCumulative} from="JPY" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("finances.table.cumActual")}</span>
                  {actualCumulative > 0 ? (
                    <Money amount={actualCumulative} from="JPY" className="text-navy font-medium" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
