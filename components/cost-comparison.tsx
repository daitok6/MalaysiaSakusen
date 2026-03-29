"use client";

import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";
import { MapPin } from "lucide-react";

const costKeys = [
  "finances.rent",
  "finances.utilities",
  "finances.food",
  "finances.transport",
  "finances.health",
  "finances.misc",
] as const;

const tokyoAmounts = [120000, 15000, 60000, 10000, 25000, 30000];
const klAmountsMYR = [3000, 400, 2500, 400, 650, 1250];
// Approximate JPY equivalents for bar width comparison
const klAmountsJPY = [45000, 6000, 37500, 6000, 9750, 18750];

export function CostComparison() {
  const { t } = useLocale();
  const tokyoTotal = tokyoAmounts.reduce((sum, v) => sum + v, 0);
  const klTotal = klAmountsMYR.reduce((sum, v) => sum + v, 0);
  const maxAmount = Math.max(...tokyoAmounts);

  return (
    <div className="space-y-4">
      {/* Bar Race */}
      <div className="glass space-y-4">
        {costKeys.map((key, i) => {
          const tokyoWidth = (tokyoAmounts[i] / maxAmount) * 100;
          const klWidth = (klAmountsJPY[i] / maxAmount) * 100;
          return (
            <div key={key} className="space-y-1.5">
              <span className="text-xs text-muted-foreground font-medium">{t(key)}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 rounded-full bg-coral/60 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(tokyoWidth, 15)}%` }}
                  />
                  <span className="text-[10px] font-bold text-coral-foreground whitespace-nowrap shrink-0">
                    <Money amount={tokyoAmounts[i]} from="JPY" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 rounded-full bg-mint/60 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(klWidth, 15)}%` }}
                  />
                  <span className="text-[10px] font-bold text-mint-foreground whitespace-nowrap shrink-0">
                    <Money amount={klAmountsMYR[i]} from="MYR" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="glass card-hover text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={14} className="text-coral-foreground" />
            <span className="pill pill-coral">{t("finances.tokyo")}</span>
          </div>
          <p className="text-xl font-bold tracking-tight">
            <Money amount={tokyoTotal} from="JPY" />
          </p>
        </div>
        <div className="glass card-hover text-center border-mint/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={14} className="text-mint-foreground" />
            <span className="pill pill-mint">{t("finances.kl")}</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-mint-foreground">
            <Money amount={klTotal} from="MYR" />
          </p>
        </div>
      </div>
    </div>
  );
}
