"use client";

import { TiltCard } from "./tilt-card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  Icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  subtitle?: string;
  color?: string;
  className?: string;
};

export function StatCard({ Icon, label, value, subtitle, color = "lavender", className = "" }: StatCardProps) {
  return (
    <TiltCard className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold tracking-tight mt-1.5">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center`}>
          <Icon size={20} className={`text-${color}-foreground`} />
        </div>
      </div>
    </TiltCard>
  );
}
