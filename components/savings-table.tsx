"use client";

import { useState } from "react";
import { Money } from "@/components/money";
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Salary (Projected)</TableHead>
            <TableHead className="text-right">Salary (Actual)</TableHead>
            <TableHead className="text-right">Side Income (Projected)</TableHead>
            <TableHead className="text-right">Side Income (Actual)</TableHead>
            <TableHead className="text-right">Cumulative (Projected)</TableHead>
            <TableHead className="text-right">Cumulative (Actual)</TableHead>
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
                        "Click to edit"
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
                        "Click to edit"
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
  );
}
