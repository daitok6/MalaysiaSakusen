"use client";

import { useCurrency } from "./currency-provider";
import { convert, formatCurrency } from "@/lib/currency";
import type { Currency } from "@/lib/types";

type MoneyProps = {
  amount: number;
  from: Currency;
  className?: string;
};

export function Money({ amount, from, className }: MoneyProps) {
  const { currency, rates, isLoading } = useCurrency();

  if (isLoading) {
    return <span className={className}>...</span>;
  }

  const converted = convert(amount, from, currency, rates);
  return <span className={className}>{formatCurrency(converted, currency)}</span>;
}
