"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/money";

const tokyoCosts: Record<string, number> = {
  "Rent (1BR furnished)": 120000,
  "Utilities + Internet": 15000,
  "Food": 60000,
  "Transport": 10000,
  "Health Insurance": 25000,
  "Misc / Entertainment": 30000,
};

const klCostsMYR: Record<string, number> = {
  "Rent (1BR furnished)": 3000,
  "Utilities + Internet": 400,
  "Food": 2500,
  "Transport": 400,
  "Health Insurance": 650,
  "Misc / Entertainment": 1250,
};

export function CostComparison() {
  const tokyoTotal = Object.values(tokyoCosts).reduce((sum, v) => sum + v, 0);
  const klTotal = Object.values(klCostsMYR).reduce((sum, v) => sum + v, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            🇯🇵 Tokyo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(tokyoCosts).map(([label, amount]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <Money amount={amount} from="JPY" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">Total</span>
            <Money amount={tokyoTotal} from="JPY" className="text-navy" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            🇲🇾 Mont Kiara, KL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(klCostsMYR).map(([label, amount]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <Money amount={amount} from="MYR" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">Total</span>
            <Money amount={klTotal} from="MYR" className="text-success" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
