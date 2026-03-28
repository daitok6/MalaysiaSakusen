"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, type Locale } from "@/lib/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("sakusen-locale", l);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sakusen-locale") as Locale | null;
    if (saved && (saved === "en" || saved === "ja")) {
      setLocaleState(saved);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale][key] ?? key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
