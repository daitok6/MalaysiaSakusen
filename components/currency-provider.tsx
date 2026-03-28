"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Currency } from "@/lib/types";
import { buildRateMap } from "@/lib/currency";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "JPY",
  setCurrency: () => {},
  rates: {},
  isLoading: true,
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("JPY");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("sakusen-currency", c);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sakusen-currency") as Currency | null;
    if (saved && ["JPY", "USD", "MYR"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        const rateMap = buildRateMap("USD", data);
        setRates(rateMap);
      } catch {
        setRates({});
      } finally {
        setIsLoading(false);
      }
    }
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}
