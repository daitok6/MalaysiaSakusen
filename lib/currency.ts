import type { Currency } from "./types";

const FALLBACK_RATES: Record<string, number> = {
  "JPY:USD": 1 / 150,
  "JPY:MYR": 4.5 / 150,
  "USD:JPY": 150,
  "USD:MYR": 4.5,
  "MYR:JPY": 150 / 4.5,
  "MYR:USD": 1 / 4.5,
};

export function convert(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<string, number>
): number {
  if (from === to) return amount;
  const key = `${from}:${to}`;
  const rate = rates[key] ?? FALLBACK_RATES[key];
  if (!rate) return amount;
  return amount * rate;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    JPY: "\u00a5",
    USD: "$",
    MYR: "RM",
  };
  const decimals = currency === "JPY" ? 0 : 2;
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbols[currency]}${formatted}`;
}

export function buildRateMap(
  base: Currency,
  apiRates: Record<string, number>
): Record<string, number> {
  const currencies: Currency[] = ["JPY", "USD", "MYR"];
  const map: Record<string, number> = {};

  for (const [to, rate] of Object.entries(apiRates)) {
    map[`${base}:${to}`] = rate;
    map[`${to}:${base}`] = 1 / rate;
  }

  for (const from of currencies) {
    for (const to of currencies) {
      if (from === to) continue;
      const key = `${from}:${to}`;
      if (map[key]) continue;
      const fromToBase = map[`${from}:${base}`];
      const baseToTo = map[`${base}:${to}`];
      if (fromToBase && baseToTo) {
        map[key] = fromToBase * baseToTo;
      }
    }
  }

  return map;
}
