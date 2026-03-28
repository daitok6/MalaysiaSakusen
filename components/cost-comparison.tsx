"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/money";
import { useLocale } from "./locale-provider";

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

export function CostComparison() {
  const { t } = useLocale();
  const tokyoTotal = tokyoAmounts.reduce((sum, v) => sum + v, 0);
  const klTotal = klAmountsMYR.reduce((sum, v) => sum + v, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            🇯🇵 {t("finances.tokyo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {costKeys.map((key, i) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t(key)}</span>
              <Money amount={tokyoAmounts[i]} from="JPY" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">{t("finances.total")}</span>
            <Money amount={tokyoTotal} from="JPY" className="text-navy" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            🇲🇾 {t("finances.kl")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {costKeys.map((key, i) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t(key)}</span>
              <Money amount={klAmountsMYR[i]} from="MYR" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">{t("finances.total")}</span>
            <Money amount={klTotal} from="MYR" className="text-success" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
